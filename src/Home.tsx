import { Link } from "@tanstack/react-location";
export function Home() {
  return (
    <div>
      <Link to="/convert">Convert</Link>
      <Link to="/css-animation">Animation</Link>
    </div>
  );
}
