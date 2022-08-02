import React, { ChangeEvent } from "react";

import "./App.css";
const CANVAS_SIZE = 1024;
const WATERMARK_WIDTH = 82; // 1 extra pixel for buffer
const WATERMARK_HEIGHT = 18; // 1 extra pixel for buffer

function imageFileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    var fr = new FileReader();
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
const getImageData = (data: string) => {
  return new Promise<ImageData>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.height = CANVAS_SIZE;
      canvas.width = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx == null) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      resolve(imageData);
    };
    img.onerror = reject;
    img.src = data;
  });
};

const findWatermark = (imageData: ImageData) => {
  const max = CANVAS_SIZE * CANVAS_SIZE * 4;
  console.log({ max, actualMax: imageData.data.length });
  for (let i = 0; i < max; i += 4) {
    const x = (i / 4) % CANVAS_SIZE;
    const y = Math.floor(i / 4 / CANVAS_SIZE);
    const r = i;
    const g = i + 1;
    const b = i + 2;
    const a = i + 3;
    if (
      x > CANVAS_SIZE - WATERMARK_WIDTH &&
      y > CANVAS_SIZE - WATERMARK_HEIGHT
    ) {
      imageData.data[a] = 0;
    }
  }
  console.log("finished scanning");
};
const removeWatermark = async (file: File) => {
  const image64 = await imageFileToBase64(file);
  const imageData = await getImageData(image64);
  console.log("image!", imageData);
  findWatermark(imageData);
  return imageData;
};

const useCanvas = () => {
  const ctxRef = React.useRef<CanvasRenderingContext2D>(null);
  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas == null) return;
    const ctx = canvas.getContext("2d");
    if (ctx == null) return;
    // to avoid weird read-only issue from the useRef hook
    (ctxRef as any).current = ctx;
    canvas.height = CANVAS_SIZE;
    canvas.width = CANVAS_SIZE;
  }, []);
  return [canvasRef, ctxRef] as const;
};

export function UploadShrink() {
  const [scale, setScale] = React.useState(0.3);
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [canvas, ctx] = useCanvas();
  const handleInput = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    async ({ target }) => {
      if (target == null) return;
      const file = target.files?.[0];
      if (file == null) return;
      const c = document.createElement("canvas");
      c.height = CANVAS_SIZE;
      c.width = CANVAS_SIZE;
      const ct = c.getContext("2d");
      const imageData = await removeWatermark(file);
      console.log("test", imageData);
      ct?.putImageData(imageData, 0, 0);
      ctx.current?.scale(scale, scale);

      ctx.current?.drawImage(
        c,
        CANVAS_SIZE * (0.5 / scale) - CANVAS_SIZE / 2,
        CANVAS_SIZE * (0.5 / scale) - CANVAS_SIZE / 2,
      );
      const url = ctx.current?.canvas.toDataURL("image/png");
      setUrl(url);
    },
    [scale],
  );
  return (
    <div className="App">
      <canvas ref={canvas} height={CANVAS_SIZE} width={CANVAS_SIZE}></canvas>
      <input type="file" onChange={handleInput} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={scale}
        onInput={(e) => setScale((e.target as HTMLInputElement).valueAsNumber)}
      />
      <div>{scale}</div>
      {url != null && (
        <a download={`scaled-${scale}.png`} href={url}>
          Download
        </a>
      )}
    </div>
  );
}
