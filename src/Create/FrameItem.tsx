import { Box, Button, Flex, IconButton, Image } from "@chakra-ui/react";
import { CloseIcon, DownloadIcon } from "@chakra-ui/icons";
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
    <Flex
      borderColor="gray.100"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      gap={4}
    >
      <Box fontSize="xx-large" alignSelf="center">
        {index + 1}
      </Box>
      <Image
        alignSelf="center"
        src={image.src}
        h="100px"
        w="100px"
        bg="gray.100"
      />
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        flex="1 1 auto"
      >
        <Box fontSize="sm">{name}</Box>
        {/* <Flex>
          <Button
            onClick={getScaledDownVersion}
            size="sm"
            alignSelf="end"
            leftIcon={<DownloadIcon />}
          >
            Get scaled down version
          </Button>
        </Flex> */}
      </Flex>
      <IconButton
        onClick={onRemoveFrameClicked}
        aria-label="Remove frame"
        icon={<CloseIcon />}
        size="sm"
        variant="ghost"
      />
    </Flex>
  );
}
