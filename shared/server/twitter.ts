import { auth } from "twitter-api-sdk";
import { HOST } from "@/shared/constant";

const getCallbackUrl = () => {
  return `${HOST}/api/xoauth`
}

export const generateAuthClient = () => {
  return new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID!,
    client_secret: process.env.TWITTER_CLIENT_SECRET!,
    callback: getCallbackUrl(),
    scopes: ["tweet.read", "users.read", "offline.access"],
    // token
  })
}