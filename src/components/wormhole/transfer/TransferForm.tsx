"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { type ChainId } from "~/lib/wormhole/types";
import { ChainSelector } from "../chain-selector/ChainSelector";
import { FeeBreakdown } from "./FeeBreakdown";
import { BridgeService } from "~/lib/wormhole/bridge-service";
import { TransferMethod } from "./TransferMethod";
import { useWalletConnection } from "~/hooks/useWalletConnection";

// Input validation schema
const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  sourceChain: z.string().min(1, "Source chain is required"),
  destinationChain: z.string().min(1, "Destination chain is required"),
});

export function TransferForm() {
  // Form state
  const [amount, setAmount] = useState<string>("");
  const [sourceChain, setSourceChain] = useState<ChainId | "">("");
  const [destinationChain, setDestinationChain] = useState<ChainId | "">("");
  
  // Bridge service for fee estimation and transfer method detection
  const [bridgeService] = useState(() => new BridgeService());
  
  // Use our custom wallet connection hook
  const { address, isConnected, isPending: isConnecting, connectWallet, formatAddress } = useWalletConnection();
  
  // Transfer method detection
  const transferMethod = sourceChain && destinationChain 
    ? bridgeService.determineTransferMethod(
        sourceChain, 
        destinationChain
      )
    : undefined;
  
  // Fee estimation
  const [feeEstimation, setFeeEstimation] = useState<{
    sourceChainFee: string;
    destinationChainFee: string;
    bridgeFee: string;
    totalFee: string;
    finalAmount: string;
  } | null>(null);
  
  // Transfer status
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input with at most one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      
      // Clear fee estimation when amount changes
      setFeeEstimation(null);
    }
  };
  
  // Handle source chain selection
  const handleSourceChainChange = (chain: ChainId) => {
    setSourceChain(chain);
    
    // Clear fee estimation when source chain changes
    setFeeEstimation(null);
  };
  
  // Handle destination chain selection
  const handleDestinationChainChange = (chain: ChainId) => {
    setDestinationChain(chain);
    
    // Clear fee estimation when destination chain changes
    setFeeEstimation(null);
  };
  
  // Estimate fees
  const handleEstimateFees = async () => {
    setError(null);
    
    try {
      // Validate form inputs
      const validationResult = formSchema.safeParse({
        amount,
        sourceChain,
        destinationChain,
      });
      
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0]?.message ?? "Invalid input");
      }
      
      if (sourceChain === destinationChain) {
        throw new Error("Source and destination chains must be different");
      }
      
      // Ensure we have a transfer method
      if (!transferMethod) {
        throw new Error("Could not determine transfer method");
      }
      
      // Estimate fees
      const fees = await bridgeService.estimateFees(
        sourceChain as ChainId,
        destinationChain as ChainId,
        amount,
        transferMethod,
      );
      
      setFeeEstimation(fees);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setFeeEstimation(null);
    }
  };
  
  // Connect wallet handler
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };
  
  // Initialize transfer
  const handleTransfer = async () => {
    setError(null);
    setIsTransferring(true);
    
    try {
      // Validate form inputs
      const validationResult = formSchema.safeParse({
        amount,
        sourceChain,
        destinationChain,
      });
      
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0]?.message ?? "Invalid input");
      }
      
      if (sourceChain === destinationChain) {
        throw new Error("Source and destination chains must be different");
      }
      
      // Ensure wallet is connected
      if (!isConnected || !address) {
        throw new Error("Wallet is not connected");
      }
      
      // Initiate transfer using the connected wallet address
      const transfer = await bridgeService.initiateTransfer(
        sourceChain as ChainId,
        destinationChain as ChainId,
        amount,
        address,
      );
      
      // In a real app, you'd redirect to a status page or show a success message
      console.log("Transfer initiated:", transfer);
      
      // Reset form
      setAmount("");
      setSourceChain("");
      setDestinationChain("");
      setFeeEstimation(null);
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsTransferring(false);
    }
  };
  
  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-sm bg-background">
      <h2 className="mb-4 text-center text-2xl font-bold">Bridge USDC</h2>
      
      <div className="space-y-4">
        {/* Source Chain Selector */}
        <div>
          <label className="mb-1 block text-sm font-medium">From</label>
          <ChainSelector 
            selectedChain={sourceChain} 
            onChainSelect={handleSourceChainChange} 
          />
        </div>
        
        {/* Destination Chain Selector */}
        <div>
          <label className="mb-1 block text-sm font-medium">To</label>
          <ChainSelector 
            selectedChain={destinationChain} 
            onChainSelect={handleDestinationChainChange}
            disabledChains={sourceChain ? [sourceChain] : []}
          />
        </div>
        
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="text"
              className="block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-muted-foreground">USDC</span>
            </div>
          </div>
        </div>
        
        {/* Wallet Connection Status */}
        {feeEstimation && (
          <div className="flex items-center justify-between rounded-md bg-secondary/20 px-3 py-2 text-sm">
            <span>Wallet Status:</span>
            <span className={`font-medium ${isConnected ? "text-green-600" : "text-amber-600"}`}>
              {isConnected && address ? formatAddress(address) : "Not Connected"}
            </span>
          </div>
        )}
        
        {/* Transfer Method */}
        {sourceChain && destinationChain && transferMethod && (
          <TransferMethod method={transferMethod} />
        )}
        
        {/* Fee Breakdown */}
        {feeEstimation && (
          <FeeBreakdown 
            sourceChainFee={feeEstimation.sourceChainFee}
            destinationChainFee={feeEstimation.destinationChainFee}
            bridgeFee={feeEstimation.bridgeFee}
            totalFee={feeEstimation.totalFee}
            finalAmount={feeEstimation.finalAmount}
          />
        )}
        
        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {!feeEstimation && (
            <Button 
              onClick={handleEstimateFees}
              disabled={!amount || !sourceChain || !destinationChain || isTransferring}
              className="w-full"
            >
              Calculate Fees
            </Button>
          )}
          
          {feeEstimation && !isConnected && (
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          
          {feeEstimation && isConnected && (
            <Button
              onClick={handleTransfer}
              disabled={isTransferring}
              className="w-full"
            >
              {isTransferring ? "Processing..." : "Bridge USDC"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 