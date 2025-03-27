"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, arbitrum, polygon, base, avalanche } from 'wagmi/chains';
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { env } from '~/env';

// Create a query client for React Query
const queryClient = new QueryClient();

// Define supported chains - these should align with the chains in our Wormhole bridge
const supportedChains = [mainnet, optimism, arbitrum, polygon, base, avalanche] as const;

// Create wagmi config with connectors
const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(), // Generic injected connector (like browser wallets)
    metaMask(), // MetaMask specific connector
    coinbaseWallet({
      appName: 'Wormhole USDC Bridge',
    }),
    walletConnect({
      projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    }),
  ],
  transports: {
    // Use public RPC providers for each chain
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [avalanche.id]: http(),
  },
});

// Wallet Provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}