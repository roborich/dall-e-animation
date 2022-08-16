import { createImage, getMaskedImage } from "./create-utils";
import {
  SaveState,
  Frame,
  StoredFrame,
  AnimationState,
  AnimationType,
  Bitrate,
} from "./create-types";
import { Bezier } from "bezier-easing-editor";
import BezierEasing from "bezier-easing";

const frameToStoredFrame = (frame: Frame): StoredFrame => ({
  name: frame.name,
  imageSrc: frame.image.src,
});

export const storedFrameToFrame = async (
  storedFrame: StoredFrame,
): Promise<Frame> => {
  const image = await createImage(storedFrame.imageSrc);
  return {
    name: storedFrame.name,
    image,
    maskedImage: await getMaskedImage(image),
  };
};

export const getDataFromJsonFile = <T extends {}>(file: File) =>
  new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        try {
          const data = JSON.parse(reader.result) as T;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("FileReader did not return a string"));
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });

export const convertStateToSave = ({
  animationType,
  bezier,
  bitrate,
  images,
  imageScale,
  length,
}: AnimationState): SaveState => ({
  animationType,
  bezier,
  bitrate,
  images: images.map(frameToStoredFrame),
  imageScale,
  length,
});

export const downloadJSON = <T extends {}>(data: T, name: string) => {
  const link = document.createElement("a");
  link.download = `${name}.json`;
  link.href = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data),
  )}`;
  link.click();
};
const defaultBezier: Bezier = [0.3, 0.1, 0.7, 0.9];

export const defaultState: AnimationState = {
  animationType: AnimationType.ZoomOut,
  bezier: defaultBezier,
  bitrate: Bitrate.Medium,
  easingFunction: BezierEasing(...defaultBezier),
  images: [],
  imageScale: 0.3,
  length: 5_000,
  recordingCallback: null,
  start: Date.now(),
};

export const convertSaveToState = async ({
  animationType,
  bezier,
  bitrate,
  images,
  imageScale,
  length,
}: SaveState): Promise<AnimationState> => ({
  ...defaultState,
  animationType,
  bezier,
  bitrate: bitrate ?? defaultState.bitrate,
  easingFunction: BezierEasing(...bezier),
  images: await Promise.all(images.map(storedFrameToFrame)),
  imageScale: imageScale ?? defaultState.imageScale,
  length,
});
