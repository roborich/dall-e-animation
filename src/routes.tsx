import { Navigate, Route } from "@tanstack/react-location";

import { Create } from "./Create";

// Temporary Low security developer flag
// const flaggedWindow = window as unknown as {
//   iamMe: VoidFunction;
//   iamNotMe: VoidFunction;
// };
// const IS_ME = localStorage.getItem("isMe");
// flaggedWindow.iamMe = () => localStorage.setItem("isMe", "true");
// flaggedWindow.iamNotMe = () => localStorage.setItem("isMe", "false");

export const routes: Route[] = [
  {
    path: "/",
    element: <Navigate to={"/create"} />,
  },
  {
    path: "/create",
    element: <Create />,
  },
];
