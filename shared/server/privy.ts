import { PrivyClient } from '@privy-io/server-auth'
import { PRIVY_APP_ID } from '../constant';

export const privyClient = new PrivyClient(PRIVY_APP_ID, process.env.PRIVY_SECRET!);

export async function verifyPrivyAccessToken(accessToken: string) {
  try {
    const verifiedClaims = await privyClient.verifyAuthToken(accessToken);
    return verifiedClaims.userId
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
  } 
}

export async function getPrivyUserInfoByUserId(userId: string) {
  const user = await privyClient.getUserById(userId);
  return user
}

export async function getPrivyUserInfoByAccessToken(accessToken: string) {
  const appId = PRIVY_APP_ID
  const privy = new PrivyClient(appId, process.env.PRIVY_SECRET!)
  try {
    const verifiedClaims = await privy.verifyAuthToken(accessToken);
    const secret = btoa(`${appId}:${process.env.PRIVY_SECRET}`)
    const options = {
      method: 'GET',
      headers: {'privy-app-id': appId, Authorization: `Basic ${secret}`}
    };

    const userInfo = await fetch(`https://api.privy.io/v1/users/${verifiedClaims.userId}`, options).then(res => res.json())
    return userInfo
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
  } 
}