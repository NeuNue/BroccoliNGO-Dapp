# BroccoliNGO Dapp

[![Website](https://img.shields.io/badge/Website-broccoli.ngo-green)](https://www.broccoli.ngo/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

BroccoliNGO is an innovative decentralized application that aims to bridge the gap between blockchain technology and non-governmental organizations. The platform provides transparent fundraising, donation tracking, and resource allocation for environmental and social causes.

Visit our website: [https://www.broccoli.ngo/](https://www.broccoli.ngo/)

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

Built with 💚 by the BroccoliNGO team.
