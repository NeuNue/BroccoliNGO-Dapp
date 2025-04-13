import * as dotenv from "dotenv";
dotenv.config();
import { getBalanceOfDate, getConfig, updateConfig } from "@/shared/server/model";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getPrivyUserInfoByAccessToken } from "@/shared/server/privy";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


const BASE_URI = 'http://localhost:3000';
const testBody = {}

async function testDuneWebhook() {
  const req = await fetch(`${BASE_URI}/api/webhook/dune`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testBody)
  })
  const res = await req.json()
  console.log(res)
}

async function testGetBalance() {
  const res = await getBalanceOfDate('0x016d26e90eca6c56b9411134f752e2a021cd93bf', '2025-04-02')
  console.log(res)
}

async function testVoteSubmit() {
  const privateKey = generatePrivateKey()
  const wallet = privateKeyToAccount(privateKey)
  const nftId = 1
  const result = false
  const signature = await wallet.signMessage({
    message: JSON.stringify({
      nftId,
      result
    })
  })
  const req = await fetch(`${BASE_URI}/api/vote/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: wallet.address,
      nftId,
      result,
      signature
    })
  })
  const res = await req.json()
  console.log(res)
}

async function testVoteResult() {
  const req = await fetch(`${BASE_URI}/api/vote/result?nftId=1`)
  const res = await req.json()
  console.log(res)
}

async function testVoteList() {
  const req = await fetch(`${BASE_URI}/api/vote/list?nftId=1&page=1&pageSize=20`)
  const res = await req.json()
  console.log(JSON.stringify(res))
}

async function testPrivy() {
  const accessToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImhacVBfdkdiSUJiYkFUNXB3UVQ2c0N0bmpSTGVrcE9NVlZOeHdKTVBCWTAifQ.eyJzaWQiOiJjbTlmZTAwaHYwMWdhbDgwbWF3a3BtdjVuIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3NDQ1MzMxNTksImF1ZCI6ImNtOThyMnk0eDAyMzVsNDBsenJ2NWt0em0iLCJzdWIiOiJkaWQ6cHJpdnk6Y205ZW1mMWUxMDJ1bmw4MG45dnF4dTVvOCIsImV4cCI6MTc0NDUzNjc1OX0.9Pu6L-5tp2M-JTM-lmnC0GeHin-4sarGMsYIGpbqO_0t1HzjhD6IuqrW1QxqhT7amSfGr93JKb6hY4Mw5QkRIQ'
  const userInfo = await getPrivyUserInfoByAccessToken(accessToken)
  console.log(userInfo)
}

async function main() {
  // await testGetBalance()
  // await testVoteSubmit()
  // await testVoteResult()
  // await testVoteList()
  await testPrivy()
}

main();
