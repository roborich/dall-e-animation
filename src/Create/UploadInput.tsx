import { useDropzone } from "react-dropzone";
import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";

import { imageFileUrl, createImage, getMaskedImage } from "./create-utils";
import { Frame } from "./create-types";
import { MdAddPhotoAlternate } from "react-icons/md";
interface UploadInputProps {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
}

export function UploadInput({ frames, setFrames }: UploadInputProps) {
  const hasImages = frames.length > 0;
  const onDropAccepted = React.useCallback<(files: File[]) => void>(
    async (files) => {
      const [file] = files;
      if (file == null) return;
      const name = file.name
        .replace(/^DALL.E [0-9\-\. ]*- /, "")
        .replace(/\.png$/, "");
      const url = await imageFileUrl(file);
      const image = await createImage(url);
      const maskedImage = await getMaskedImage(image);
      setFrames((prev) => [{ name, image, maskedImage }, ...prev]);
    },
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/png": [".png"] },
    onDropAccepted,
  });
  return (
    <Flex
      flex="1 1 50%"
      {...getRootProps()}
      bg={hasImages ? "gray.100" : "green.200"}
      p={8}
      borderStyle="dotted"
      borderWidth={4}
      borderRadius="md"
      color="gray.800"
      alignItems="center"
      justifyContent="center"
    >
      <input {...getInputProps()} />
      <Flex alignItems="center">
        <Icon as={MdAddPhotoAlternate} mx={2} w={12} h={12} />
        <Box>{hasImages ? "Add next image" : "Add an image here to begin"}</Box>
      </Flex>
    </Flex>
  );
}
