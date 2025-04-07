import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useWriteContract,
} from "wagmi";
import {
  BROCCOLI_TREASURY_ADDRESS,
  DONATE_BNB_TYPE,
  DONATE_TYPE,
  TOKEN_ABIs,
  TOKEN_ADDRESSES,
} from "../constant";
import { parseEther } from "viem";

export default function useDonate() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  async function donate(amount: string, type: DONATE_BNB_TYPE | DONATE_TYPE) {
    if (type === DONATE_BNB_TYPE.BNB) {
      return donateBNB(amount);
    }
    return donateERC20(amount, type);
  }

  async function donateBNB(amount: string) {
    return sendTransactionAsync({
      to: BROCCOLI_TREASURY_ADDRESS,
      value: parseEther(amount),
    });
  }

  async function donateERC20(amount: string, type: DONATE_TYPE) {
    console.log("donateERC20", amount, type);
    const tx = await writeContractAsync({
      address: TOKEN_ADDRESSES[type],
      abi: TOKEN_ABIs[type],
      functionName: "transfer",
      args: [BROCCOLI_TREASURY_ADDRESS, parseEther(amount)],
    });
    const res = await publicClient?.waitForTransactionReceipt({
      hash: tx,
    });
    return res;
  }

  return {
    address,
    donate,
  };
}
