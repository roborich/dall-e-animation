import { Outlet, ReactLocation, Router } from "@tanstack/react-location";
const location = new ReactLocation();
import { routes } from "./routes";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Router location={location} routes={routes}>
        <Outlet />
      </Router>
    </ChakraProvider>
  );
}

export default App;
