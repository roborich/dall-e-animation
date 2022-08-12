import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import BezierEasing from "bezier-easing";
import React from "react";

import { AnimationState, AnimationType } from "./create-types";

import BezierEditor from "bezier-easing-editor";

export function AnimationSettings({
  animationState,
}: {
  animationState: React.MutableRefObject<AnimationState>;
}) {
  return (
    <Flex p={4} flexDirection="column" gap={4}>
      <FormControl>
        <FormLabel>Animation Type</FormLabel>

        <RadioGroup
          defaultValue={animationState.current.animationType}
          onChange={(value: AnimationType) => {
            animationState.current.animationType = value;
          }}
        >
          <Stack direction="column">
            <Radio value={AnimationType.ZoomOut}>Zoom-out</Radio>
            <Radio value={AnimationType.ZoomIn}>Zoom-in</Radio>
            <Radio value={AnimationType.ZoomOutIn}>Zoom-out/in</Radio>
            <Radio value={AnimationType.ZoomInOut}>Zoom-in/out</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Animation Duration</FormLabel>
        <InputGroup>
          <NumberInput
            defaultValue={animationState.current.length / 1000}
            onChange={(_, value) => {
              animationState.current.length = value * 1000;
            }}
          >
            <NumberInputField></NumberInputField>
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputRightAddon children="seconds" />
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Easing</FormLabel>
        <BezierEditor
          defaultValue={animationState.current.bezier}
          onChange={(value) => {
            animationState.current.bezier = value;
            animationState.current.easingFunction = BezierEasing(...value);
          }}
        ></BezierEditor>
      </FormControl>
    </Flex>
  );
}
