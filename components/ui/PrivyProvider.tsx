'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyProviders({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider 
      appId="cm98r2y4x0235l40lzrv5ktzm"
      clientId="client-WY5ijkyewKqkxBLLb7JRtGHXUnKt7mCzV58xnpJcccYX7"
      config={{
      "appearance": {
        "accentColor": "#6A6FF5",
        "theme": "#FFFFFF",
        "showWalletLoginFirst": false,
        "logo": "https://auth.privy.io/logos/privy-logo.png",
        "walletChainType": "ethereum-and-solana",
        "walletList": [
          "detected_wallets",
          "metamask",
          "phantom"
        ]
      },
      "loginMethods": [
        "email",
        "twitter",
        "wallet",
      ],
      "fundingMethodConfig": {
        "moonpay": {
          "useSandbox": true
        }
      },
      "embeddedWallets": {
        "requireUserPasswordOnCreate": false,
        "showWalletUIs": true,
        "ethereum": {
          "createOnLogin": "users-without-wallets"
        },
        "solana": {
          "createOnLogin": "users-without-wallets"
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