import React from "react";

import { Grid, GridItem } from "@chakra-ui/react";

import { Frame } from "./create-types";

import { Frames } from "./Frames";
import { Animation } from "./Animation";

export function Create() {
  const [frames, setFrames] = React.useState<Frame[]>([]);

  return (
    <Grid templateColumns="1fr 1fr">
      <GridItem p={8}>
        <Frames frames={frames} setFrames={setFrames} />
      </GridItem>
      <GridItem p={8}>
        <Animation frames={frames} />
      </GridItem>
    </Grid>
  );
}
