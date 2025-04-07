import { NextResponse } from 'next/server'
import { TWITTER_CODE_CHALLENGE } from '@/shared/constant';
import { generateAuthClient } from '@/shared/server/twitter';

export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 0;

export async function POST(req: Request) {

  const { referral_from } = await req.json()

  const authClient = generateAuthClient()

  const authUrl = authClient.generateAuthURL({
    state: referral_from || 'default',
    code_challenge_method: "plain",
    code_challenge: TWITTER_CODE_CHALLENGE,
  });

  return NextResponse.json({
    code: 0,
    data: {
      url: authUrl
    }
  })
}
