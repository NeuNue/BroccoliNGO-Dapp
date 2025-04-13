'use client';
import { useEffect, useState } from 'react';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';
import { fetchProfileV2 } from '@/shared/api';

export default function LoginWithEmail() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout()

  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    async function getToken() {
      const token = await getAccessToken()
      setAccessToken(token || '')
    }
    getToken()
  }, [])

  useEffect(() => {
    if (ready && authenticated) {
      fetchProfileV2()
    }
  }, [authenticated])

  return (
    <div>
      { user && 
        <div className='whitespace-pre-wrap'>
          <p>Access Token: {accessToken}</p>
          <p>{JSON.stringify(user, null, 2)}</p>
        </div>
      }
      { authenticated ? 
        <button onClick={logout}>
        Log out
        </button> : 
        <button onClick={login}>
          Log in
        </button>
      }
    </div>
  );
}