import { bsc, bscTestnet } from "viem/chains";
import B714NGOABI from "./abi/B714NGO";
import BroccoliABI from "./abi/Broccoli714";
// import BUSDABI from "./abi/BUSD";
import USDCABI from "./abi/USDC";
import USDTABI from "./abi/USDT";
import { Address } from "viem";

export const isBeta =
  process.env.PREVIEW === "true" || process.env.NEXT_PUBLIC_BETA === "true";

export const mainChain = isBeta ? bscTestnet : bsc;
export const ABI = B714NGOABI;

export const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export enum DONATE_BNB_TYPE {
  BNB = "BNB",
}
export enum DONATE_TYPE {
  BROCCOLI = "Broccoli",
  USDC = "USDC",
  USDT = "USDT",
}
export const TOKEN_ADDRESSES = {
  [DONATE_TYPE.BROCCOLI]:
    "0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714" as Address,
  [DONATE_TYPE.USDC]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d" as Address,
  [DONATE_TYPE.USDT]: "0x55d398326f99059ff775485246999027b3197955" as Address,
};

export const TOKEN_ABIs = {
  [DONATE_TYPE.BROCCOLI]: BroccoliABI,
  [DONATE_TYPE.USDC]: USDCABI,
  [DONATE_TYPE.USDT]: USDTABI,
};

export const BROCCOLI_TREASURY_ADDRESS =
  "0x0022DC116Bed13dDb7635298723B45a582d50C2e" as Address;

export const topics = {
  AddProof:
    "0x1c14184783ccad097098b792881fdc26c6f87516fc3e53977ac8e16c2226ae88",
  AddFundRecord:
    "0x582879c86699e94b207a8d714b57a2a074d3701ce6e1d5aa0ddb2d1b15e619bd",
  SetApproval:
    "0xe13abd0d13c74157eab5214e002f5db73eef0be87d7cf267312e698d69c661dd",
  Transfer:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
};

export const hashToTopicMap = (() => {
  const inverted: Record<string, string> = {};
  Object.entries(topics).forEach(([key, value]) => {
    const valueAsKey = String(value);
    inverted[valueAsKey] = key;
  });
  return inverted;
})();

export const TWITTER_CODE_CHALLENGE = process.env.TWITTER_CODE_CHALLENGE ?? "";

export const HOST = process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000";

export const TOKEN_NAME = "broccoli_token";

export const BSC_RPC_URL = isBeta
  ? "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
  : "https://broccoli.rpc.48.club";

export const BSC_OFFICIAL_RPC_URL = "https://bsc-dataseed.bnbchain.org";

export const BROCCOLI_ADMIN_WHITELIST =
  process.env.BROCCOLI_ADMIN_WHITELIST?.split(",") || [];

export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || "";
export const PRIVY_SECRET = process.env.PRIVY_SECRET || "";
export const PRIVY_TOKEN_NAME = "privy-token";
