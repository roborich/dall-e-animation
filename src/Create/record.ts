import { AnimationState, PlayType } from "./create-types";
const mimeTypes = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
  "video/mp4",
];
const mimeType: string | undefined = mimeTypes.filter((type) =>
  MediaRecorder.isTypeSupported(type),
)[0];
const fileExtension = mimeType?.includes("webm") ? "webm" : "mp4";
if (!mimeType) {
  console.error("Your browser does not support mp4 or webm video recording");
}

export const record = (
  ctx: CanvasRenderingContext2D,
  state: AnimationState,
) => {
  const videoStream = ctx.canvas.captureStream(30);
  mimeTypes.forEach((type) => {
    const isSupported = MediaRecorder.isTypeSupported(type);
    console.log(`${type} : ${isSupported}`);
  });

  const mediaRecorder = new MediaRecorder(videoStream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
    audioBitsPerSecond: 0,
  });
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.animationType}-${state.images.length}-images.${fileExtension}`;
    link.click();
  };

  state.start = Date.now();
  mediaRecorder.start();
  let resolve: (v: unknown) => void;
  const done = new Promise((r) => {
    resolve = r;
  });
  state.recordingCallback = () => {
    state.recordingCallback = null;
    mediaRecorder.stop();
    resolve(undefined);
  };
  return done;
};
