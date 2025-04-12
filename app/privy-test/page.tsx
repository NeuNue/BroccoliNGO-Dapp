'use client';
import { useState } from 'react';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';

export default function LoginWithEmail() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout()
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div>
      { user && 
        <div className='whitespace-pre-wrap'>
          {JSON.stringify(user, null, 2)}
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