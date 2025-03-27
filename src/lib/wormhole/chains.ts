import { type ChainConfig, chainIdSchema } from "./types";

// Chain configuration data
export const chainConfigs: Record<string, ChainConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    icon: "/images/chains/ethereum.svg",
    nativeToken: "ETH",
    supportsCCTP: true,
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    rpcUrl: "https://rpc.ankr.com/eth",
    blockExplorer: "https://etherscan.io",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    icon: "/images/chains/polygon.svg",
    nativeToken: "MATIC",
    supportsCCTP: true,
    usdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    icon: "/images/chains/avalanche.svg",
    nativeToken: "AVAX",
    supportsCCTP: true,
    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://snowtrace.io",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "/images/chains/arbitrum.svg",
    nativeToken: "ETH",
    supportsCCTP: true,
    usdcAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    icon: "/images/chains/optimism.svg",
    nativeToken: "ETH",
    supportsCCTP: true,
    usdcAddress: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    rpcUrl: "https://mainnet.optimism.io",
    blockExplorer: "https://optimistic.etherscan.io",
  },
  base: {
    id: "base",
    name: "Base",
    icon: "/images/chains/base.svg",
    nativeToken: "ETH",
    supportsCCTP: true,
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
  },
  solana: {
    id: "solana",
    name: "Solana",
    icon: "/images/chains/solana.svg",
    nativeToken: "SOL",
    supportsCCTP: true,
    usdcAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    blockExplorer: "https://explorer.solana.com",
  },
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    icon: "/images/chains/bsc.svg",
    nativeToken: "BNB",
    supportsCCTP: false, // Example of a chain that doesn't support CCTP
    usdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
  },
};

// Utility functions to work with chains
export const getSupportedChains = () => Object.values(chainConfigs);

export const getSupportedChainIds = () => Object.keys(chainConfigs);

export const getChainConfig = (chainId: string) => {
  // Validate chainId
  try {
    chainIdSchema.parse(chainId);
    return chainConfigs[chainId];
  } catch (error) {
    throw new Error(`Invalid chain ID: ${chainId}`);
  }
}; 