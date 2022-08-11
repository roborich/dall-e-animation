import { Box, Button, Flex, Icon } from "@chakra-ui/react";

import React, { useCallback, useEffect } from "react";
import { FULL_CANVAS_SIZE } from "../constants";
import { Frame, PlayType, AnimationState, AnimationType } from "./create-types";
import { useCanvas } from "./useCanvas";
import { HiHeart } from "react-icons/hi";
import { record } from "./record";
import { DownloadIcon, SpinnerIcon } from "@chakra-ui/icons";

const useAnimationFrameCallback = (
  cb: VoidFunction,
  deps: React.DependencyList,
) => {
  const memoizedCallback = useCallback(cb, deps);
  const cbRef = React.useRef(memoizedCallback);
  const runId = React.useRef<Symbol | undefined>(undefined);

  useEffect(() => {
    cbRef.current = cb;
  }, [memoizedCallback]);

  useEffect(() => {
    runId.current = Symbol();
    const run = (id: Symbol) => {
      if (id === runId.current) {
        cb();
        requestAnimationFrame(() => run(id));
      }
    };
    run(runId.current);

    return () => {
      runId.current = undefined;
    };
  }, []);
};

export function Animation(props: {
  frames: Frame[];
  animationState: React.MutableRefObject<AnimationState>;
}) {
  const { animationState } = props;
  const [playType, setPlayType] = React.useState(PlayType.Auto);
  const { canvasRef, ctxRef } = useCanvas();

  useEffect(() => {
    animationState.current.start = Date.now();
    animationState.current.images = props.frames;
  }, [props.frames]);

  useAnimationFrameCallback(() => {
    if (ctxRef.current == null) {
      return;
    }
    runFrame(ctxRef.current, animationState.current);
  }, []);

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h="100%"
      flexDirection="column"
    >
      <Box>
        <canvas ref={canvasRef} style={{ height: "90vh" }}></canvas>
      </Box>
      <Box>
        <Button
          m={4}
          leftIcon={
            playType === PlayType.Recording ? <SpinnerIcon /> : <DownloadIcon />
          }
          onClick={() => {
            setPlayType(PlayType.Recording);
            record(ctxRef.current!, animationState.current).then(() => {
              setPlayType(PlayType.Auto);
              animationState.current.start = Date.now();
            });
          }}
          disabled={playType === PlayType.Recording || props.frames.length < 2}
        >
          {playType === PlayType.Recording ? "Recording" : "Export Video"}
        </Button>
        <a href="https://www.buymeacoffee.com/roborich" target="_blank">
          <Button leftIcon={<Icon as={HiHeart} color="red.500" />}>
            Buy me some DALL·E 2 credits
          </Button>
        </a>
      </Box>
    </Flex>
  );
}

export const animationTypeTimingMap: Record<
  AnimationType,
  (v: number) => number
> = {
  [AnimationType.ZoomIn]: (v) => v,
  [AnimationType.ZoomOut]: (v) => 1 - v,
  [AnimationType.ZoomInOut]: (v) => (v > 0.5 ? 1 - v : v) * 2,
  [AnimationType.ZoomOutIn]: (v) => (v < 0.5 ? 1 - v : v) / 2,
};

function calculateTime(state: AnimationState) {
  let t = 0;
  const elapsed = Date.now() - state.start;
  t = (elapsed % state.length) / state.length;
  t = animationTypeTimingMap[state.animationType](t);
  t = state.easingFunction(t);
  if (elapsed >= state.length) {
    state.recordingCallback?.();
  }
  t = t * (state.images.length - 1);
  return t;
}

function runFrame(ctx: CanvasRenderingContext2D, state: AnimationState) {
  if (state.images.length === 0) {
    return;
  }
  if (state.images.length === 1) {
    ctx.drawImage(state.images[0].image, 0, 0);
    return;
  }

  const t = calculateTime(state);

  ctx.clearRect(0, 0, FULL_CANVAS_SIZE, FULL_CANVAS_SIZE);

  state.images.forEach(drawImageAtScale(ctx, state, t));
}

function drawImageAtScale(
  ctx: CanvasRenderingContext2D,
  { images }: AnimationState,
  t: number,
) {
  return ({ image, maskedImage }: Frame, index: number) => {
    const negativeIndex = images.length - index - 1;
    const scale = 0.3 ** (t - negativeIndex);
    if (scale < 0.1 || scale > 4.5) {
      return;
    }
    const size = FULL_CANVAS_SIZE * scale;
    const offset = FULL_CANVAS_SIZE / 2 - size / 2;
    const img = index === 0 ? image : maskedImage ?? image;
    ctx.drawImage(
      img,
      0,
      0,
      FULL_CANVAS_SIZE,
      FULL_CANVAS_SIZE,
      offset,
      offset,
      size,
      size,
    );
  };
}
