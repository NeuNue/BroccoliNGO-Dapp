import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  okxWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  binanceWallet
} from "@rainbow-me/rainbowkit/wallets";
import { createClient, createPublicClient, http, webSocket } from "viem";
import { createConfig } from "wagmi";
import { BSC_RPC_URL, mainChain } from "./constant";

const connectors = connectorsForWallets(
  [
    // {
    //   groupName: "Recommended",
    //   wallets: [coinbaseWallet, rainbowWallet],
    // },
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, binanceWallet],
    },
  ],
  {
    appName: "BroccoliNGO",
    projectId: "6e62dd34f8015eb882182d7d05cbec97",
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainChain],
  client({ chain }) {
    return createClient({ chain, transport: http(BSC_RPC_URL) });
  },
  ssr: true,
});
