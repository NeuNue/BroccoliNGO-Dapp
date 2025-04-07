"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/shared/wagmi";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

const client = new QueryClient();

const rainbowKitTheme = {
  accentColor: "#6A3CD6",
};

function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider locale="en-US" theme={darkTheme(rainbowKitTheme)}>
          <ChakraProvider>
            <Toaster />
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppProvider;
