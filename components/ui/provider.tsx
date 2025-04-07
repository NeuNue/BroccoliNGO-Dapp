"use client";

import {
  ChakraProvider,
  defaultSystem,
  createSystem,
  defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider forcedTheme="light" {...props} />
    </ChakraProvider>
  );
}
