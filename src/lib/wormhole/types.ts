import { z } from "zod";

// Chain schemas
export const chainIdSchema = z.enum([
  "ethereum",
  "polygon",
  "avalanche",
  "arbitrum",
  "optimism",
  "base",
  "solana",
  "bsc",
]);

export type ChainId = z.infer<typeof chainIdSchema>;

// USDC Transfer method schemas
export const transferMethodSchema = z.enum([
  "cctp", // Cross-Chain Transfer Protocol (for native USDC)
  "wormhole", // Wormhole Token Bridge (for wrapped USDC)
]);

export type TransferMethod = z.infer<typeof transferMethodSchema>;

// Transfer status schemas
export const transferStatusSchema = z.enum([
  "not_started",
  "initiating",
  "pending",
  "confirming",
  "redeeming",
  "completed",
  "failed",
]);

export type TransferStatus = z.infer<typeof transferStatusSchema>;

// Transfer data schema
export const transferDataSchema = z.object({
  id: z.string().uuid(),
  sourceChain: chainIdSchema,
  destinationChain: chainIdSchema,
  amount: z.string(), // String to avoid precision issues with large numbers
  transferMethod: transferMethodSchema,
  status: transferStatusSchema,
  txHash: z.string().optional(),
  vaa: z.string().optional(),
  estimatedFee: z.string().optional(),
  finalAmount: z.string().optional(),
  timestamp: z.date(),
});

export type TransferData = z.infer<typeof transferDataSchema>;

// Chain configuration schema with RPC URLs and token addresses
export const chainConfigSchema = z.object({
  id: chainIdSchema,
  name: z.string(),
  icon: z.string(),
  nativeToken: z.string(),
  supportsCCTP: z.boolean(),
  usdcAddress: z.string(),
  rpcUrl: z.string(),
  blockExplorer: z.string(),
});

export type ChainConfig = z.infer<typeof chainConfigSchema>;

// Fee estimation schema
export const feeEstimationSchema = z.object({
  sourceChainFee: z.string(),
  destinationChainFee: z.string(),
  bridgeFee: z.string(),
  totalFee: z.string(),
  finalAmount: z.string(),
});

export type FeeEstimation = z.infer<typeof feeEstimationSchema>; 