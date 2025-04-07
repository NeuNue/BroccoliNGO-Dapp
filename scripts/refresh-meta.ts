import * as dotenv from "dotenv";
dotenv.config();
import { refreshTaskMeta } from "@/shared/server/model";

async function doRefreshTaskMeta(tokenId: number) {
  refreshTaskMeta(tokenId);
}

doRefreshTaskMeta(22);
