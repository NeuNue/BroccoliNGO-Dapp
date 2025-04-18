"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/shared/wagmi";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import PrivyProviders from "./PrivyProvider";
import { GlobalContextProvider } from "@/hooks/useGlobal";

const client = new QueryClient();

const rainbowKitTheme = {
  accentColor: "#FEC535",
};

function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <PrivyProviders>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider locale="en-US" theme={darkTheme(rainbowKitTheme)}>
            <ChakraProvider>
              <Toaster />
              <GlobalContextProvider>{children}</GlobalContextProvider>
            </ChakraProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProviders>
  );
}

export default AppProvider;
