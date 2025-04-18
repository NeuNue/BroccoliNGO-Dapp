import * as dotenv from "dotenv";
dotenv.config();
import { debugLog, handleEvents, syncEvents } from "@/shared/server/sync";
import { createPublicClient, http } from "viem";
import { BSC_RPC_URL, mainChain } from "@/shared/constant";
import { getConfig, updateConfig } from "@/shared/server/model";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const publicClient = createPublicClient({
  chain: mainChain,
  transport: http(BSC_RPC_URL),
});

let start = 0;
let step = 100;
let totalBlock = 0;

async function syncDataWithRange(from: number, to: number) {
  debugLog(`Syncing data from ${from} to ${to}`);
  await syncEvents(from, to);
  await handleEvents();
}

async function main() {
  const config = await getConfig();
  start = parseInt(config[`indexer_progress`]);
  step = parseInt(config[`indexer_step`]);
  while (true) {
    totalBlock = Number(await publicClient.getBlockNumber()) - 20;
    const endBlock = Math.min(start + step, totalBlock);
    try {
      await syncDataWithRange(start, endBlock);
      start = endBlock;
      await updateConfig(`indexer_progress`, start.toString());
    } catch (e: any) {
      console.log(e);
      debugLog(e.toString(), "error");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main();
