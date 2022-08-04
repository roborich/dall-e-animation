import { Link, Navigate, Route } from "@tanstack/react-location";
import { UploadShrink } from "./UploadShrink";
import { Animation } from "./Animation";
import { Home } from "./Home";
import { Create } from "./Create";

// Temporary Low security developer flag
const flaggedWindow = window as unknown as {
  iamMe: VoidFunction;
  iamNotMe: VoidFunction;
};
const IS_ME = localStorage.getItem("isMe");
flaggedWindow.iamMe = () => localStorage.setItem("isMe", "true");
flaggedWindow.iamNotMe = () => localStorage.setItem("isMe", "false");

export const routes: Route[] = [
  {
    path: "/",
    element: <Navigate to={IS_ME ? "/home" : "/css-animation"} />,
  },
  { path: "css-animation", element: <Animation /> },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/create",
    element: <Create />,
  },
];
