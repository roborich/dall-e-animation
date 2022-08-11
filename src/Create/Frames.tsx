import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  Heading,
  useBoolean,
  VStack,
} from "@chakra-ui/react";

import { Frame } from "./create-types";
import { FrameItem } from "./FrameItem";
import { InfoIcon } from "@chakra-ui/icons";

interface FramesProps {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
}
export function Frames({ frames, setFrames }: FramesProps) {
  const [isOpen, setIsOpen] = useBoolean(false);
  const removeFrame = React.useCallback(
    (index: number) => () => {
      setFrames((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    },
    [],
  );

  return (
    <>
      <Button disabled={frames.length === 0} onClick={setIsOpen.on}>
        Show All Images ({frames.length})
      </Button>
      <Drawer isOpen={isOpen} onClose={setIsOpen.off} placement="left">
        <DrawerContent>
          <DrawerBody>
            <VStack align="stretch">
              <Heading>Images</Heading>
              {frames.map((frame, index, { length }) => (
                <FrameItem
                  key={length - index - 1}
                  {...frame}
                  index={length - index - 1}
                  onRemoveFrameClicked={removeFrame(index)}
                />
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
