import { Frame } from "./create-types";
import React from "react";
import {
  removeWatermark,
  getImageData,
  getScaledImgUrl,
  getScaledFileName,
} from "./create-utils";
import { Box, Flex, IconButton, Image } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

interface PaddedImageDownloadProps {
  frames: Frame[];
}
export function PaddedImageDownload({ frames }: PaddedImageDownloadProps) {
  const [previousFrame] = frames;
  const lastImageScaledUrl = React.useMemo(
    () =>
      previousFrame == null
        ? undefined
        : getScaledImgUrl(
            removeWatermark(getImageData(previousFrame.image)),
            0.3,
          ),
    [previousFrame],
  );

  if (previousFrame == null) {
    return null;
  }
  return (
    <Flex
      flex="1 1 50%"
      borderColor="gray.100"
      borderWidth="1px"
      borderRadius="md"
      alignItems="center"
      p={4}
    >
      <Image src={lastImageScaledUrl} h="100px" w="100px" />
      <Box p={4}>Previous image padded</Box>
      <a
        href={lastImageScaledUrl}
        download={getScaledFileName(previousFrame.name, frames.length - 1)}
      >
        <IconButton aria-label="download" icon={<DownloadIcon />} />
      </a>
    </Flex>
  );
}
