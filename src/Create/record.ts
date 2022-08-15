import { AnimationState } from "./create-types";
// import { CanvasCapture } from "canvas-capture";

const mimeTypes = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
];
const mimeType: string | undefined = mimeTypes.filter((type) =>
  MediaRecorder.isTypeSupported(type),
)[0];

const getExtension = (mimeType: string) =>
  mimeType.match(/video\/([a-z0-9]*)/)?.[1] ?? ".webm";

export const record = (
  ctx: CanvasRenderingContext2D,
  state: AnimationState,
) => {
  const videoStream = ctx.canvas.captureStream(30);
  const options: MediaRecorderOptions = {
    videoBitsPerSecond: 8_000_000,
  };
  if (mimeType) {
    options.mimeType = mimeType;
  }
  const mediaRecorder = new MediaRecorder(videoStream, options);

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = function (e) {
    const blob =
      chunks.length === 1
        ? chunks[0]
        : new Blob(chunks, { type: mediaRecorder.mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.animationType}-${
      state.images.length
    }-images.${getExtension(mediaRecorder.mimeType)}`;
    link.click();
  };

  state.start = Date.now();
  mediaRecorder.start();
  let resolve: (v: unknown) => void;
  const done = new Promise((r) => {
    resolve = r;
  });

  // executed every frame
  state.recordingCallback = (elapsed) => {
    if (elapsed >= state.length) {
      state.recordingCallback = null;
      mediaRecorder.stop();
      resolve(undefined);
    }
  };
  return done;
};

// So that we only call initialize once.
// const getInitializer = () => {
//   let isInitialized = false;
//   return (canvas: HTMLCanvasElement) => {
//     if (!isInitialized) {
//       isInitialized = true;
//       CanvasCapture.init(canvas);
//     }
//   };
// };
// const init = getInitializer();

// export const recordAlt = (
//   ctx: CanvasRenderingContext2D,
//   state: AnimationState,
// ) => {
//   const canvas = ctx.canvas;
//   init(canvas);
//   let resolve: (v: unknown) => void;
//   const done = new Promise((r) => {
//     resolve = r;
//   });

//   state.start = Date.now();
//   CanvasCapture.beginVideoRecord({ format: CanvasCapture.MP4 });

//   state.recordingCallback = (elapsed) => {
//     CanvasCapture.recordFrame();

//     if (elapsed >= state.length) {
//       state.recordingCallback = null;
//       CanvasCapture.stopRecord().then(resolve);
//     }
//   };

//   return done;
// };
