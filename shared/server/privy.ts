import { PrivyClient } from '@privy-io/server-auth'

export async function getPrivyUserInfoByAccessToken(accessToken: string) {
  const appId = 'cm98r2y4x0235l40lzrv5ktzm'
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