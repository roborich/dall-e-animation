import { AnimationState, PlayType } from "./create-types";

export const record = (
  ctx: CanvasRenderingContext2D,
  state: AnimationState,
) => {
  const videoStream = ctx.canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(videoStream, {
    mimeType: "video/webm;codecs=VP9",
    videoBitsPerSecond: 8_000_000,
    audioBitsPerSecond: 0,
  });
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, { type: "video/webm;codecs=VP9" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "video.webm";
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
