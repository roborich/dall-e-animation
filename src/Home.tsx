import { Box, HStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-location";
export function Home() {
  return (
    <HStack spacing={4}>
      <Link to="/css-animation">Animation</Link>
      <Link to="/create">Create</Link>
    </HStack>
  );
}
