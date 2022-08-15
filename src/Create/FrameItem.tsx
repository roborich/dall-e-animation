import { Box, Flex, IconButton, Image } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Frame } from "./create-types";

interface FrameItemProps extends Frame {
  index: number;
  onRemoveFrameClicked: VoidFunction;
}
export const FrameItem = ({
  image,
  index,
  onRemoveFrameClicked,
}: FrameItemProps) => (
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
