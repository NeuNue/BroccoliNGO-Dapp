# 🥦 BroccoliNGO Dapp

![Broccoli Banner](/public/Broccoli_banner.jpg)

[![Website](https://img.shields.io/badge/Website-broccoli.ngo-green)](https://www.broccoli.ngo/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

BroccoliNGO is an open-source decentralized application (dApp) built on BNB Chain, initiated by the Broccoli CTO Community. Our mission is to revolutionize charity and pet rescue efforts by leveraging blockchain’s transparency, ensuring every donation is verifiable on-chain.

As a community-led project, we invite developers and community members to collaborate in building a future where charity is truly transparent and impactful.

Visit our website: [https://www.broccoli.ngo/](https://www.broccoli.ngo/)

## About Broccoli

Broccoli is a community-driven memecoin on BNB Smart Chain, inspired by CZ’s beloved dog, Broccoli. More than just a token, the Broccoli ecosystem champions real-world utility, with BroccoliNGO being a key initiative to merge blockchain innovation with social good.

CA: 0x6d5AD1592ed9D6D1dF9b93c793AB759573Ed6714

## Project Structure

The BroccoliNGO Dapp is built using Next.js and follows a modern React application structure:

```
BroccoliNGO_Dapp/
├── app/                    # Next.js app directory (App Router)
│   ├── api/                # API routes for server-side functionality
│   └── [...routes]/        # Page routes and components
├── components/             # Reusable React components
├── public/                 # Static files (images, fonts, etc.)
├── hooks/                  # React hooks
├── shared/                 # Shared utilities and constants
│   ├── constant.ts         # Application constants
│   ├── server/             # Server-side utilities
│   │   ├── jwt.ts          # JWT authentication
│   │   ├── redis.ts        # Redis client/mock
│   │   └── twitter.ts      # Twitter API integration
│   └── supabase.ts         # Supabase client configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Local Development Setup

Follow these steps to set up the BroccoliNGO Dapp for local development:

### Prerequisites

- Node.js 18.x or later
- pnpm or yarn package manager
- Git

### Installation

1.  Clone the repository:

```bash
https://github.com/Broccoli-CTO/BroccoliNGO-Dapp.git
cd BroccoliNGO_Dapp
```

2.  Install dependencies:

```bash
pnpm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.sample .env
```

4.Start the development server:

```bash
pnpm run dev
# or
yarn dev
```

## Contributing

We welcome contributions to BroccoliNGO! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js
- Supabase
- Twitter API
- Upstash Redis

---

Built with 💚 for BroccoliNGO.
