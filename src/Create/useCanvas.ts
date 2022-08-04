import React from "react";
import { FULL_CANVAS_SIZE } from "../constants";

export const useCanvas = (type?: "offscreen") => {
  const ctxRef = React.useRef<CanvasRenderingContext2D>(null);
  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas == null) return;
    const ctx = canvas.getContext("2d");
    if (ctx == null) return;
    // to avoid weird read-only issue from the useRef hook
    (ctxRef as any).current = ctx;
    canvas.height = FULL_CANVAS_SIZE;
    canvas.width = FULL_CANVAS_SIZE;
  }, []);

  React.useEffect(() => {
    if (type === "offscreen") {
      canvasRef(document.createElement("canvas"));
      return () => {
        canvasRef(null);
      };
    }
  }, [type]);

  return { canvasRef, ctxRef };
};
