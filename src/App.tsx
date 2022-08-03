import "./App.css";

import { Outlet, ReactLocation, Router } from "@tanstack/react-location";
const location = new ReactLocation();
import { routes } from "./routes";
function App() {
  return (
    <div className="App">
      <Router location={location} routes={routes}>
        <Outlet />
      </Router>
    </div>
  );
}

export default App;
