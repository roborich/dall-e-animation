import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Select,
  SelectField,
} from "@chakra-ui/react";

import React, { useCallback, useEffect } from "react";
import { FULL_CANVAS_SIZE } from "../constants";
import {
  Frame,
  PlayType,
  AnimationState,
  AnimationType,
  Bitrate,
} from "./create-types";
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
        requestAnimationFrame(() => run(id));
        cb();
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

  useAnimationFrameCallback(() => {
    if (ctxRef.current == null) {
      return;
    }
    runFrame(ctxRef.current, animationState.current);
  }, []);

  const startRecording = React.useCallback(() => {
    setPlayType(PlayType.Recording);
    record(ctxRef.current!, animationState.current).then(() => {
      setPlayType(PlayType.Auto);
      animationState.current.start = Date.now();
    });
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
      <Flex flexDirection="row" gap={4} m={4} alignItems="center">
        <Flex alignItems="center">
          <FormLabel color="white">Bitrate</FormLabel>
          <Select
            bg="white"
            w="150px"
            color="gray.600"
            defaultValue={animationState.current.bitrate}
            onChange={(e) => {
              animationState.current.bitrate = Number(e.target.value);
            }}
          >
            <option value={Bitrate.Low}>Low</option>
            <option value={Bitrate.Medium}>Medium</option>
            <option value={Bitrate.High}>High</option>
            <option value={Bitrate.Max}>Max</option>
          </Select>
        </Flex>
        <Box>
          <Button
            leftIcon={
              playType === PlayType.Recording ? (
                <SpinnerIcon />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={startRecording}
            disabled={
              playType === PlayType.Recording || props.frames.length < 2
            }
          >
            {playType === PlayType.Recording ? "Recording" : "Export Video"}
          </Button>
        </Box>
        <Box>
          <a href="https://www.buymeacoffee.com/roborich" target="_blank">
            <Button leftIcon={<Icon as={HiHeart} color="red.500" />}>
              Buy me credits
            </Button>
          </a>
        </Box>
      </Flex>
    </Flex>
  );
}

export const animationTypeTimingMap: Record<
  AnimationType,
  (v: number) => number
> = {
  [AnimationType.ZoomIn]: (v) => 1 - v,
  [AnimationType.ZoomOut]: (v) => v,
  [AnimationType.ZoomInOut]: (v) => {
    const n = 1 - v;
    return (n < 0.5 ? 1 - n : n) * 2 - 1;
  },
  [AnimationType.ZoomOutIn]: (v) => {
    return (v > 0.5 ? 1 - v : v) * 2;
  },
};

function calculateTime(elapsed: number, state: AnimationState) {
  let t = 0;
  t = (elapsed % state.length) / state.length;
  t = animationTypeTimingMap[state.animationType](t);
  t = state.easingFunction(t);
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
  const elapsed = Date.now() - state.start;
  const t = calculateTime(elapsed, state);

  ctx.clearRect(0, 0, FULL_CANVAS_SIZE, FULL_CANVAS_SIZE);

  state.images.forEach(drawImageAtScale(ctx, state, t));
  state.recordingCallback?.(elapsed);
}

function drawImageAtScale(
  ctx: CanvasRenderingContext2D,
  { images, imageScale }: AnimationState,
  t: number,
) {
  return ({ image, maskedImage }: Frame, index: number) => {
    const negativeIndex = images.length - index - 1;
    const scale = imageScale ** (t - negativeIndex);
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
