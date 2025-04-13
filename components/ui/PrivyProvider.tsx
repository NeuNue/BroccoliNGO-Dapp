'use client';

import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from '@/shared/constant';
import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyProviders({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider 
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID}
      config={{
      "appearance": {
        "accentColor": "#6A6FF5",
        "theme": "#FFFFFF",
        "showWalletLoginFirst": false,
        "logo": "https://auth.privy.io/logos/privy-logo.png",
      },
      "loginMethods": [
        "email",
      ],
      "fundingMethodConfig": {
        "moonpay": {
          "useSandbox": true
        }
      },
      "mfa": {
        "noPromptOnMfaRequired": false
      },
    }}
    >
      {children}
    </PrivyProvider>
  );
}