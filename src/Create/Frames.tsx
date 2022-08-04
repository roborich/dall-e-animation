import { useDropzone } from "react-dropzone";
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import {
  removeWatermark,
  imageFileUrl,
  getImageData,
  getScaledImgUrl,
  getScaledFileName,
  createImage,
} from "./create-utils";
import { Frame } from "./create-types";
import { FrameItem } from "./FrameItem";

interface FramesProps {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
}
export function Frames({ frames, setFrames }: FramesProps) {
  const lastFrame = frames.at(-1);
  const lastImageScaledUrl = React.useMemo(
    () =>
      lastFrame == null
        ? undefined
        : getScaledImgUrl(removeWatermark(getImageData(lastFrame.image)), 0.3),
    [lastFrame],
  );
  const removeFrame = React.useCallback(
    (index: number) => () => {
      setFrames((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    },
    [],
  );
  const onDropAccepted = React.useCallback<(files: File[]) => void>(
    async (files) => {
      const [file] = files;
      if (file == null) return;
      const c = document.createElement("canvas");
      // c.height = FULL_CANVAS_SIZE;
      // c.width = FULL_CANVAS_SIZE;
      const name = file.name
        .replace(/^DALL.E [0-9\-\. ]*- /, "")
        .replace(/\.png$/, "");
      const url = await imageFileUrl(file);
      const image = await createImage(url);
      const imageData = getImageData(image);
      setFrames((prev) => [...prev, { name, url, imageData, image }]);
    },
    [],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/png": [".png"] },
    onDropAccepted,
  });

  return (
    <Box>
      <Heading p={2}>Frames</Heading>
      <VStack spacing={2} align="stretch">
        {frames.map((frame, index) => (
          <FrameItem
            key={frame.image.src}
            {...frame}
            index={index}
            onRemoveFrameClicked={removeFrame(index)}
          />
        ))}
        <Flex gap={3}>
          {lastFrame != null && (
            <Flex
              flex="1 1 50%"
              borderColor="gray.100"
              borderWidth="1px"
              borderRadius="md"
              alignItems="center"
              p={4}
            >
              <Image src={lastImageScaledUrl} h="100px" w="100px" />
              <Box>Next frame source</Box>
              <a
                href={lastImageScaledUrl}
                download={getScaledFileName(lastFrame.name, frames.length - 1)}
              >
                <Button>Download</Button>
              </a>
            </Flex>
          )}
          <Flex
            flex="1 1 50%"
            {...getRootProps()}
            bg="gray.100"
            p={8}
            borderStyle="dotted"
            borderWidth={4}
            borderRadius="md"
            color="gray.500"
            alignItems="center"
            justifyContent="center"
          >
            <input {...getInputProps()} />
            <Box>
              <AddIcon /> Add a frame
            </Box>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
}
