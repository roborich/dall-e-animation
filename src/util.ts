import { FULL_CANVAS_SIZE } from "./constants";
export const getTemporaryCanvasContext = () => {
  const canvas = document.createElement("canvas");
  canvas.height = FULL_CANVAS_SIZE;
  canvas.width = FULL_CANVAS_SIZE;
  return canvas.getContext("2d")!;
};

export const getScaleCenterOffset = (scale: number) => {
  return FULL_CANVAS_SIZE * (0.5 / scale) - FULL_CANVAS_SIZE / 2;
};
