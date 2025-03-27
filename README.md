# Wormhole USDC Transfer Tool

A modern, secure application for transferring USDC between different blockchains using Wormhole's cross-chain bridging technology.

![Wormhole USDC Bridge](https://user-images.githubusercontent.com/some_user/some_repo/wormhole-usdc-bridge-preview.png)

## Features

- **Intelligent Routing**: Automatically chooses between CCTP (for native USDC) or Wormhole Token Bridge (for wrapped USDC) depending on chain support
- **Real-time Status Tracking**: Monitor your transfer progress with a step-by-step interface
- **Fee Estimation**: Get accurate cost breakdowns before initiating transfers
- **Secure by Design**: Implements VAA verification and replay protection
- **Developer-Ready**: Modular architecture that can be extended or integrated

## Tech Stack

- Next.js 15 & React 19
- Tailwind CSS 4 & shadcn/ui
- tRPC 11
- Wormhole SDK 1.14.0
- Drizzle ORM

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 9.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wormhole-usdc-bridge.git
cd wormhole-usdc-bridge
```

2. Install dependencies
```bash
pnpm install
```

3. Copy the example environment file and configure it
```bash
cp .env.example .env
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

This application is structured around the following components:

- **Bridge Service**: Core class that interfaces with the Wormhole SDK
- **Transfer Form**: UI component for initiating transfers
- **Status Tracking**: Components for monitoring cross-chain transfers
- **Chain Selector**: UI for selecting source and destination chains

## Security

This implementation includes:

- VAA (Verifiable Action Approval) verification
- Replay protection to prevent double-spending
- Automatic retry mechanisms for network issues

## Supported Chains

The current implementation supports:

- Ethereum (Mainnet)
- Polygon
- Avalanche
- Arbitrum
- Optimism
- Base
- Solana
- BNB Chain

## Development

### Running Tests

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Wormhole](https://wormhole.com/) for their cross-chain bridging technology
- [T3 Stack](https://create.t3.gg/) for the project template
