import { Box, Flex } from "@chakra-ui/react";
import React, { Reducer, useCallback, useEffect, useRef } from "react";
import { FULL_CANVAS_SIZE } from "../constants";
import { getScaleCenterOffset } from "../util";
import { Frame } from "./create-types";
import { useCanvas } from "./useCanvas";

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
    console.log("mounted");
  }, []);
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
interface AnimationState {
  t: number;
  direction: 1 | -1;
  speed: number;
  frames: Frame[];
}

export function Animation(props: { frames: Frame[] }) {
  const animationState = React.useRef<AnimationState>({
    t: 0,
    direction: 1,
    speed: 0.01,
    frames: props.frames,
  });
  const { canvasRef, ctxRef } = useCanvas();

  useEffect(() => {
    animationState.current.frames = props.frames;
    console.log("state update", animationState.current);
  }, [props.frames]);

  useAnimationFrameCallback(() => {
    if (ctxRef.current == null) {
      return;
    }
    runFrame(ctxRef.current, animationState.current);
  }, []);

  return (
    <Flex alignItems="center" justifyContent="center" h="100%">
      <canvas
        ref={canvasRef}
        style={{ height: "500px", width: "500px", background: "gray" }}
      ></canvas>
    </Flex>
  );
}

function runFrame(ctx: CanvasRenderingContext2D, state: AnimationState) {
  if (state.frames.length === 0) {
    return;
  }
  if (state.frames.length === 1) {
    // ctx.drawImage(state.frames[0].image, 0, 0);
    return;
  }
  if (state.t > state.frames.length - 1) {
    state.direction = -1;
  }
  if (state.t < 0) {
    state.direction = 1;
  }

  state.t = state.t + state.direction * state.speed;

  ctx.clearRect(0, 0, FULL_CANVAS_SIZE, FULL_CANVAS_SIZE);

  state.frames
    .slice()
    .reverse()
    .forEach(({ image }, i) => {
      drawImageAtScale(ctx, image, state.t, i, state.frames.length);
    });
  ctx.font = "28px sans";
  ctx.fillStyle = "red";
  ctx.fillText(state.t.toFixed(2), 40, 28);
}

function drawImageAtScale(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  t: number,
  index: number,
  frameCount: number,
) {
  const negativeIndex = frameCount - index - 1;
  const scale = 0.3 ** (t - negativeIndex);
  if (scale < 0.1 || scale > 4) {
    return;
  }
  const size = FULL_CANVAS_SIZE * scale;
  const offset = FULL_CANVAS_SIZE / 2 - size / 2;

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
}
