import { ethers, formatUnits } from "ethers";

async function getERC20Balance(address: string, blockNumber: string) {
  const provider = new ethers.JsonRpcProvider("https://broccoli.rpc.48.club");
  const tokenAddress = "0x6d5AD1592ed9D6D1dF9b93c793AB759573Ed6714";
  const abi = ["function balanceOf(address owner) view returns (uint256)"];
  const contract = new ethers.Contract(tokenAddress, abi, provider);

  const balance = await contract.balanceOf(address, { blockTag: blockNumber });

  console.log(`Balance at block ${blockNumber}: ${formatUnits(balance, 18)}`);
}

const blockNumber = 48202073;
// 48181712
const b = 47915159
getERC20Balance(
  "0xCC24b2a3E6a7F7B0EA4066aBcC2D5DCe2D96FfaC",
  `0x${blockNumber.toString(16)}`
);
