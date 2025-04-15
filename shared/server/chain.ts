import {
  createPublicClient,
  createWalletClient,
  publicActions,
  http,
  TransactionReceipt,
  decodeEventLog,
} from "viem";
import { ABI, BSC_OFFICIAL_RPC_URL, CONTRACT_ADDRESS, mainChain, topics } from "@/shared/constant";
import { privateKeyToAccount } from "viem/accounts";
import { createAndHandleEvents } from "@/shared/server/model";

const privateKey = process.env.PRIVATE_KEY;

// Ensure private key has 0x prefix
const formattedKey = privateKey?.startsWith("0x")
  ? privateKey
  : `0x${privateKey}`;

const account = privateKeyToAccount(formattedKey as `0x${string}`);

const walletClient = createWalletClient({
  chain: mainChain,
  transport: http(BSC_OFFICIAL_RPC_URL),
  account,
}).extend(publicActions);

export const createTask = async (url: string) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "mintItem",
    args: [account.address, url],
  });
  console.log('-- hash', hash)
  const receipt: TransactionReceipt = await walletClient.waitForTransactionReceipt({ hash });
  console.log('- create task receipt:', receipt);
  await createAndHandleEvents(receipt);
  return hash;
};

export const approveTask = async (id: number | string) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "setApproval",
    args: [BigInt(id), true],
  });
  const receipt: TransactionReceipt = await walletClient.waitForTransactionReceipt({ hash });
  await createAndHandleEvents(receipt);
  return hash;
};

export const fundTask = async (id: number | string, ipfsUrl: string) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "addFundRecord",
    args: [BigInt(id), ipfsUrl],
  });
  const receipt: TransactionReceipt = await walletClient.waitForTransactionReceipt({ hash });
  await createAndHandleEvents(receipt);
  return hash;
};

export const addProof = async (id: number | string, uri: string) => {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "addProof",
    args: [BigInt(id), uri],
  });
  const receipt: TransactionReceipt = await walletClient.waitForTransactionReceipt({ hash });
  await createAndHandleEvents(receipt);
  return hash;
};
