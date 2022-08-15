import { AnimationState, Frame } from "./create-types";
import React from "react";
import {
  removeWatermark,
  getImageData,
  getScaledImgUrl,
  getScaledFileName,
} from "./create-utils";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
const labelStyles = {
  mt: "2",
  ml: "-2.5",
  fontSize: "sm",
};
interface PaddedImageDownloadProps {
  frames: Frame[];
  imageScale: number;
  setImageScale: React.Dispatch<React.SetStateAction<number>>;
}
export function PaddedImageDownload({
  frames,
  imageScale,
  setImageScale,
}: PaddedImageDownloadProps) {
  const scaleIsLocked = frames.length > 1;
  const [previousFrame] = frames;
  const lastImageScaledUrl = React.useMemo(
    () =>
      previousFrame == null
        ? undefined
        : getScaledImgUrl(
            removeWatermark(getImageData(previousFrame.image)),
            imageScale,
          ),
    [previousFrame, imageScale],
  );

  return (
    <>
      {previousFrame == null ? null : (
        <Flex
          flex="1 1 50%"
          borderColor="gray.100"
          borderWidth="1px"
          borderRadius="md"
          alignItems="center"
          p={4}
        >
          <Image
            src={lastImageScaledUrl}
            h="100px"
            w="100px"
            bg="gray.50"
            borderColor="gray.100"
            borderWidth="2px"
            borderStyle="dashed"
          />
          <Flex flexDirection="column" p={3}>
            <Text fontSize="sm">Source for the next image</Text>
            <Tooltip
              label={`Download the previous image padded and scaled to ${
                imageScale * 100
              }%.`}
            >
              <a
                href={lastImageScaledUrl}
                download={getScaledFileName(
                  previousFrame.name,
                  frames.length - 1,
                )}
              >
                <Button
                  aria-label="download"
                  leftIcon={<DownloadIcon />}
                  mt={1}
                >
                  Download
                </Button>
              </a>
            </Tooltip>
          </Flex>
        </Flex>
      )}
      <Tooltip
        isDisabled={!scaleIsLocked}
        label="To prevent breaking your project, the image scale is locked after a 2nd image is added."
      >
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          pb={8}
        >
          <FormLabel>
            Image scale down percentage{scaleIsLocked && " 🔒"}
          </FormLabel>

          <Slider
            maxW="200px"
            defaultValue={imageScale}
            min={0.3}
            max={0.6}
            step={0.1}
            isDisabled={scaleIsLocked}
            onChange={setImageScale}
          >
            <SliderMark value={0.3} {...labelStyles}>
              30%
            </SliderMark>
            <SliderMark value={0.4} {...labelStyles}>
              40%
            </SliderMark>
            <SliderMark value={0.5} {...labelStyles}>
              50%
            </SliderMark>
            <SliderMark value={0.6} {...labelStyles}>
              60%
            </SliderMark>
            <SliderTrack bg="gray.300">
              <Box position="relative" right={10} />
            </SliderTrack>
            <SliderThumb boxSize={5} bg="red.500" />
          </Slider>
        </Flex>
      </Tooltip>
    </>
  );
}
