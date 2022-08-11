import { FULL_CANVAS_SIZE } from "../constants";
const WATERMARK_WIDTH = 82; // 1 extra pixel for buffer
const WATERMARK_HEIGHT = 18; // 1 extra pixel for buffer
const MASK_SIZE = 20;
import { getScaleCenterOffset, getTemporaryCanvasContext } from "../util";

export function imageFileUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (typeof fr.result === "string") {
        resolve(fr.result);
      } else {
        reject(new Error("FileReader did not return a string"));
      }
    };
    fr.onerror = reject;
    console.log("reading file", file);
    fr.readAsDataURL(file);
  });
}

export const getImageData = (image: HTMLImageElement) => {
  const ctx = getTemporaryCanvasContext();
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, FULL_CANVAS_SIZE, FULL_CANVAS_SIZE);
  return imageData;
};

export const removeWatermark = (sourceImageData: ImageData) => {
  const imageData = new ImageData(
    new Uint8ClampedArray(sourceImageData.data),
    sourceImageData.width,
    sourceImageData.height,
  );
  const max = FULL_CANVAS_SIZE * FULL_CANVAS_SIZE * 4;

  for (let i = 0; i < max; i += 4) {
    const x = (i / 4) % FULL_CANVAS_SIZE;
    const y = Math.floor(i / 4 / FULL_CANVAS_SIZE);
    // const r = i;
    // const g = i + 1;
    // const b = i + 2;
    const a = i + 3;
    if (
      x > FULL_CANVAS_SIZE - WATERMARK_WIDTH &&
      y > FULL_CANVAS_SIZE - WATERMARK_HEIGHT
    ) {
      imageData.data[a] = 0;
    }
  }
  return imageData;
};

export const getScaledImgUrl = (imageData: ImageData, scale: number) => {
  const fullCtx = getTemporaryCanvasContext();
  const scaledCtx = getTemporaryCanvasContext();
  scaledCtx.scale(scale, scale);
  const scaledCenterOffset = getScaleCenterOffset(scale);

  fullCtx.putImageData(imageData, 0, 0);
  scaledCtx.drawImage(fullCtx.canvas, scaledCenterOffset, scaledCenterOffset);
  return scaledCtx.canvas.toDataURL("image/png");
};

export const getScaledFileName = (name: string, index: number) =>
  `frame ${index + 1} scaled - ${name}.png`;

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

const HALF_SIZE = FULL_CANVAS_SIZE / 2;
const MAX_ALPHA = 255;
const MASK_DEPTH = 100;
const ALPHA_STEP = MAX_ALPHA / MASK_DEPTH;
export const getMaskedImage = (image: HTMLImageElement) => {
  const imageData = getImageData(image);
  const max = FULL_CANVAS_SIZE * FULL_CANVAS_SIZE * 4;

  for (let i = 0; i < max; i += 4) {
    const x = (i / 4) % FULL_CANVAS_SIZE;
    const y = Math.floor(i / 4 / FULL_CANVAS_SIZE);

    const a = i + 3;
    const hx = x < HALF_SIZE ? x : FULL_CANVAS_SIZE - x;
    const hy = y < HALF_SIZE ? y : FULL_CANVAS_SIZE - y;
    const ax = Math.min((hx - MASK_SIZE) * ALPHA_STEP - MAX_ALPHA, 0);
    const ay = Math.min((hy - MASK_SIZE) * ALPHA_STEP - MAX_ALPHA, 0);
    imageData.data[a] += ax;
    imageData.data[a] += ay;
    if (
      x < MASK_SIZE ||
      x > FULL_CANVAS_SIZE - MASK_SIZE ||
      y < MASK_SIZE ||
      y > FULL_CANVAS_SIZE - MASK_SIZE
    ) {
      imageData.data[a] = 0;
    }
  }
  const ctx = getTemporaryCanvasContext();
  ctx.putImageData(imageData, 0, 0);
  const url = ctx.canvas.toDataURL("image/png");
  return createImage(url);
};
