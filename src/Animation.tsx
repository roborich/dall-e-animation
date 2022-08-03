import React, { CSSProperties } from "react";
import styled from "@emotion/styled";
const frameCount = 21;
const frames = Array.from(
  { length: frameCount },
  (_, i) => `/frames/f${i + 1}.png`,
);

const StyledFrame = styled.div`
  height: 1024px;
  width: 1024px;
  background-color: #333;
  background-image: var(--frame);

  // mask-image: radial-gradient(black 40%, transparent 60%);
  & > div {
    transform: scale(0.3);
  }
`;

const Wrapper = styled.div`
  height: 1024px;
  max-height: 90vh;
  width: 1024px;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(transparent 30%, black 90%);
  & > div,
  & > div > div,
  & > div > div > div {
    // position: relative;

    // z-index: -1;
    transform: scale(var(--zoom));

    transform: scale(var(--zoom));
  }
`;

const Frame: React.FC<{ frame: string; children?: React.ReactElement }> = ({
  frame,
  children,
}) => {
  return (
    <StyledFrame style={{ "--frame": `url(${frame})` } as CSSProperties}>
      {children}
    </StyledFrame>
  );
};
interface ZoomState {
  in: boolean;
  zoom: number;
}
const MAX_ZOOM = 2.2;
export function Animation() {
  // const [zoom, setZoom] = React.useState(1);
  const [zoomState, nextZoomState] = React.useReducer(
    (prev: ZoomState) => {
      if (prev.in && prev.zoom > MAX_ZOOM) {
        return { in: false, zoom: prev.zoom };
      }
      if (!prev.in && prev.zoom < 1) {
        return { in: true, zoom: prev.zoom };
      }
      return { ...prev, zoom: prev.zoom + (prev.in ? 0.0004 : -0.0004) };
    },
    { in: true, zoom: 1 },
  );
  const expZoom = React.useMemo(() => zoomState.zoom ** 10, [zoomState]);
  React.useEffect(() => {
    const doIt = () => {
      nextZoomState();
      requestAnimationFrame(doIt);
    };
    doIt();
  }, []);
  const out = frames.reduce(
    (output, frame) => <Frame frame={frame}>{output}</Frame>,
    <></>,
  );
  return (
    <div>
      {/* <input
        style={{ width: "100%" }}
        type="range"
        min={1}
        step={0.001}
        max={10}
        value={zoom}
        onInput={(e) => setZoom(e.target.valueAsNumber)}
      /> */}
      {/* Zoom = {zoomState.zoom}
      Direction = {zoomState.in ? "in" : "out"} */}
      <Wrapper style={{ "--zoom": expZoom } as CSSProperties}>
        <div>
          <div>{out}</div>
        </div>
      </Wrapper>
    </div>
  );
}
