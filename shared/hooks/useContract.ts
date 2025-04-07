import { Address } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "../constant";

export function useContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  async function getTaskTokenURI(id: bigint | number | string) {
    if (!publicClient) {
      return "";
    }
    const res = await publicClient?.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "tokenURI",
      args: [BigInt(id)],
    });
    return res;
  }
  
  async function getTaskApproveState(id: bigint | number | string) {
    if (!publicClient) {
      return "";
    }
    const res = await publicClient?.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'approval',
      args: [BigInt(id)],
    });
    return res;
  }

  async function getTaskFundRecord(id: bigint | number | string, index: bigint | number | string) {
    if (!publicClient) {
      return "";
    }
    const res = await publicClient?.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'fundRecord',
      args: [BigInt(id), BigInt(index)],
    });
    return res;
  }

  async function getTaskProof(id: bigint | number | string, index: bigint | number | string) {
    if (!publicClient) {
      return "";
    }
    const res = await publicClient?.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'fundRecord',
      args: [BigInt(id), BigInt(index)],
    });
    return res;
  }

  return {
    address,
    getTaskTokenURI,
    getTaskApproveState,
    getTaskFundRecord,
    getTaskProof,
  };
}
