import React, { useCallback } from "react";
import { use100vh } from "react-div-100vh";
import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";

import { AnimationState, Frame } from "./create-types";

import { Frames } from "./Frames";
import { Animation } from "./Animation";

import { AnimationSettings } from "./AnimationSettings";
import { UploadInput } from "./UploadInput";
import { PaddedImageDownload } from "./PaddedImageDownload";

import { UploadProject } from "./UploadProject";
import {
  convertStateToSave,
  defaultState,
  downloadJSON,
} from "./storage-utils";

export function Create() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [frames, setFrames] = React.useState<Frame[]>([]);

  const animationState = React.useRef<AnimationState>(defaultState);

  const height = use100vh();
  return (
    <Grid
      templateAreas={`"settings animation" "save animation"`}
      templateRows="1fr auto-fit"
      templateColumns="380px 1fr"
      h={`${height}px`}
      overflow="hidden"
    >
      <GridItem p={4} overflowY="auto" gridArea="settings">
        <Flex flexDirection="column" gap={4}>
          <UploadInput frames={frames} setFrames={setFrames} />
          <PaddedImageDownload frames={frames} />
          <Frames frames={frames} setFrames={setFrames} />
          <Divider />
          {isUploading ? (
            <Flex alignItems="center" justifyContent="center" flex="1 1 200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <AnimationSettings animationState={animationState} />
          )}
        </Flex>
      </GridItem>
      <GridItem gridArea="save" borderTopWidth="1px" borderTopColor="gray.300">
        <UploadProject
          frames={frames}
          animationState={animationState}
          setFrames={setFrames}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      </GridItem>
      <GridItem bg="gray.900" gridArea="animation">
        <Animation frames={frames} animationState={animationState} />
      </GridItem>
    </Grid>
  );
}
