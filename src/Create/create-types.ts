import { EasingFunction } from "bezier-easing";
import { Bezier } from "bezier-easing-editor";

export interface Frame {
  name: string;
  image: HTMLImageElement;
  maskedImage: HTMLImageElement;
}

export interface StoredFrame {
  name: string;
  imageSrc: string;
}

export enum PlayType {
  Auto = "auto",
  Recording = "recording",
}

export enum AnimationType {
  ZoomIn = "zoom-in",
  ZoomOut = "zoom-out",
  ZoomInOut = "zoom-in-out",
  ZoomOutIn = "zoom-out-in",
}
export type ClockFunction = (cb: VoidFunction) => void;

export interface AnimationState {
  images: Frame[];
  start: number;
  length: number;
  bezier: Bezier;
  easingFunction: EasingFunction;
  animationType: AnimationType;
  recordingCallback: null | ((elapsedTime: number) => void);
}
export interface SaveState {
  animationType: AnimationType;
  bezier: Bezier;
  images: StoredFrame[];
  length: number;
}
