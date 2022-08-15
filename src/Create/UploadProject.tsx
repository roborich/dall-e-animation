import { useDropzone } from "react-dropzone";
import React from "react";
import { Button, Divider, Flex, Icon, Progress } from "@chakra-ui/react";
import { MdUpload, MdSaveAlt } from "react-icons/md";

import {
  getDataFromJsonFile,
  convertSaveToState,
  convertStateToSave,
  downloadJSON,
} from "./storage-utils";
import { AnimationState, Frame, SaveState } from "./create-types";

interface UploadInputProps {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
  setImageScale: React.Dispatch<React.SetStateAction<number>>;
  animationState: React.MutableRefObject<AnimationState>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UploadProject({
  frames,
  animationState,
  setFrames,
  setImageScale,
  isUploading,
  setIsUploading,
}: UploadInputProps) {
  const save = React.useCallback(() => {
    const saveState = convertStateToSave(animationState.current);
    downloadJSON(
      saveState,
      `dalle-zoom-project-${animationState.current.images.length}`,
    );
  }, []);

  const onDropAccepted = React.useCallback<(files: File[]) => void>(
    async (files) => {
      setFrames([]);
      setIsUploading(true);
      const [file] = files;
      if (file == null) return;
      const data = await getDataFromJsonFile<SaveState>(file);
      const state = await convertSaveToState(data);
      animationState.current = state;
      setFrames(state.images);
      if (state.imageScale) {
        setImageScale(state.imageScale);
      }
      setIsUploading(false);
    },
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/json": [".json"] },
    onDropAccepted,
  });
  return (
    <Flex flexDirection="row" gap={4} margin={4}>
      <Button
        disabled={frames.length === 0}
        leftIcon={<Icon as={MdSaveAlt} />}
        onClick={save}
      >
        Save Project
      </Button>
      <Button
        leftIcon={<Icon as={MdUpload} rotate="md" />}
        {...getRootProps()}
        disabled={isUploading}
      >
        <input {...getInputProps()} />
        Upload Project
      </Button>
    </Flex>
  );
}
