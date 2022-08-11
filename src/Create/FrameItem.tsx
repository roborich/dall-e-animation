import { Box, Button, Flex, IconButton, Image } from "@chakra-ui/react";
import { CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { Frame } from "./create-types";
import React from "react";
import {
  getImageData,
  getScaledFileName,
  getScaledImgUrl,
  removeWatermark,
} from "./create-utils";

interface FrameItemProps extends Frame {
  index: number;
  onRemoveFrameClicked: VoidFunction;
}
export function FrameItem({
  name,
  image,
  index,
  // imageData,
  onRemoveFrameClicked,
}: FrameItemProps) {
  const getScaledDownVersion = React.useCallback(() => {
    const data = getImageData(image);
    const cleaned = removeWatermark(data);
    const url = getScaledImgUrl(cleaned, 0.3);
    const a = document.createElement("a");
    a.href = url;
    a.download = getScaledFileName(name, index);
    a.click();
  }, [image, index, name]);

  return (
    <Flex gap={4}>
      <Box fontSize="x-large" alignSelf="center" flex="0 0 30px">
        {index + 1}
      </Box>
      <Image
        alignSelf="center"
        src={image.src}
        h="100px"
        w="100px"
        bg="gray.100"
      />
      <IconButton
        onClick={onRemoveFrameClicked}
        aria-label="Remove frame"
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
      />
    </Flex>
  );
}
