"use client";

import { useEffect, useState } from "react";
import { type TransferData } from "~/lib/wormhole/types";
import { BridgeService } from "~/lib/wormhole/bridge-service";
import { Button } from "~/components/ui/button";

interface TransferStatusProps {
  transfer: TransferData;
  onComplete?: () => void;
}

export function TransferStatus({ transfer: initialTransfer, onComplete }: TransferStatusProps) {
  const [transfer, setTransfer] = useState<TransferData>(initialTransfer);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [bridgeService] = useState(() => new BridgeService());
  
  // Periodically check transfer status
  useEffect(() => {
    if (transfer.status === "completed" || transfer.status === "failed") {
      return;
    }
    
    const intervalId = setInterval(() => {
      // Define an async function inside to properly handle promises
      const checkStatus = async () => {
        try {
          const updatedTransfer = await bridgeService.checkTransferStatus(transfer);
          setTransfer(updatedTransfer);
          
          if (updatedTransfer.status === "completed" && onComplete) {
            onComplete();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred while checking status");
        }
      };
      
      // Execute the async function
      void checkStatus();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [transfer, bridgeService, onComplete]);
  
  // Handle manual completion
  const handleComplete = async () => {
    if (transfer.status !== "confirming" || !transfer.vaa) {
      return;
    }
    
    setIsCompleting(true);
    setError(null);
    
    try {
      const updatedTransfer = await bridgeService.completeTransfer(transfer);
      setTransfer(updatedTransfer);
      
      if (updatedTransfer.status === "completed" && onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during completion");
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Get status step index (0-3)
  const getStepIndex = () => {
    switch (transfer.status) {
      case "not_started":
        return 0;
      case "initiating":
      case "pending":
        return 1;
      case "confirming":
      case "redeeming":
        return 2;
      case "completed":
        return 3;
      case "failed":
        return -1; // Special case for failed transfers
      default:
        return 0;
    }
  };
  
  const stepIndex = getStepIndex();
  
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-bold">Transfer Status</h2>
      
      {/* Transfer Details */}
      <div className="mb-6 rounded-md bg-muted/30 p-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground">From</p>
            <p className="font-medium">{transfer.sourceChain}</p>
          </div>
          <div>
            <p className="text-muted-foreground">To</p>
            <p className="font-medium">{transfer.destinationChain}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">{transfer.amount} USDC</p>
          </div>
          <div>
            <p className="text-muted-foreground">Method</p>
            <p className="font-medium">{transfer.transferMethod === "cctp" ? "Native USDC" : "Wrapped USDC"}</p>
          </div>
        </div>
        
        {transfer.txHash && (
          <div className="mt-2 pt-2 text-xs text-muted-foreground">
            <span>TX: </span>
            <span className="font-mono">{transfer.txHash.slice(0, 10)}...{transfer.txHash.slice(-8)}</span>
          </div>
        )}
      </div>
      
      {/* Status Stepper */}
      <div className="mb-6">
        <ol className="relative flex w-full justify-between">
          {/* Step 1: Initiate */}
          <li className={`flex flex-col items-center ${stepIndex >= 0 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              stepIndex >= 0 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}>
              1
            </div>
            <span className="mt-1 text-xs">Initiate</span>
          </li>
          
          {/* Progress Line 1-2 */}
          <div className={`absolute left-[calc(16.67%-4px)] right-[calc(83.33%-4px)] top-4 h-0.5 -translate-y-1/2 ${
            stepIndex >= 1 ? "bg-primary" : "bg-muted-foreground"
          }`} />
          
          {/* Step 2: Process */}
          <li className={`flex flex-col items-center ${stepIndex >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              stepIndex >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}>
              2
            </div>
            <span className="mt-1 text-xs">Process</span>
          </li>
          
          {/* Progress Line 2-3 */}
          <div className={`absolute left-[calc(50%-4px)] right-[calc(50%-4px)] top-4 h-0.5 -translate-y-1/2 ${
            stepIndex >= 2 ? "bg-primary" : "bg-muted-foreground"
          }`} />
          
          {/* Step 3: Confirm */}
          <li className={`flex flex-col items-center ${stepIndex >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              stepIndex >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}>
              3
            </div>
            <span className="mt-1 text-xs">Confirm</span>
          </li>
          
          {/* Progress Line 3-4 */}
          <div className={`absolute left-[calc(83.33%-4px)] right-[calc(16.67%-4px)] top-4 h-0.5 -translate-y-1/2 ${
            stepIndex >= 3 ? "bg-primary" : "bg-muted-foreground"
          }`} />
          
          {/* Step 4: Complete */}
          <li className={`flex flex-col items-center ${stepIndex >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              stepIndex >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
            }`}>
              4
            </div>
            <span className="mt-1 text-xs">Complete</span>
          </li>
        </ol>
      </div>
      
      {/* Status Details */}
      <div className="mb-6 rounded-md bg-card p-4 text-center">
        {transfer.status === "not_started" && (
          <p>Transfer has not started yet.</p>
        )}
        
        {transfer.status === "initiating" && (
          <div className="space-y-2">
            <p className="font-medium">Initiating Transfer</p>
            <p className="text-sm text-muted-foreground">Preparing to send your tokens across chains...</p>
            <div className="mx-auto h-1 w-32 animate-pulse rounded-full bg-primary/60" />
          </div>
        )}
        
        {transfer.status === "pending" && (
          <div className="space-y-2">
            <p className="font-medium">Processing on Source Chain</p>
            <p className="text-sm text-muted-foreground">Your transaction is being processed on {transfer.sourceChain}...</p>
            <div className="mx-auto h-1 w-32 animate-pulse rounded-full bg-primary/60" />
          </div>
        )}
        
        {transfer.status === "confirming" && (
          <div className="space-y-2">
            <p className="font-medium">Waiting for Confirmation</p>
            <p className="text-sm text-muted-foreground">Transaction has been verified. Ready to complete on {transfer.destinationChain}.</p>
            {transfer.vaa && (
              <Button onClick={handleComplete} disabled={isCompleting}>
                {isCompleting ? "Completing..." : "Complete Transfer"}
              </Button>
            )}
          </div>
        )}
        
        {transfer.status === "redeeming" && (
          <div className="space-y-2">
            <p className="font-medium">Finalizing on Destination Chain</p>
            <p className="text-sm text-muted-foreground">Completing the transfer on {transfer.destinationChain}...</p>
            <div className="mx-auto h-1 w-32 animate-pulse rounded-full bg-primary/60" />
          </div>
        )}
        
        {transfer.status === "completed" && (
          <div className="space-y-2 text-green-600">
            <p className="text-2xl">✓</p>
            <p className="font-medium">Transfer Complete!</p>
            <p className="text-sm">You have received {transfer.finalAmount ?? transfer.amount} USDC on {transfer.destinationChain}</p>
          </div>
        )}
        
        {transfer.status === "failed" && (
          <div className="space-y-2 text-destructive">
            <p className="text-2xl">✗</p>
            <p className="font-medium">Transfer Failed</p>
            <p className="text-sm">Something went wrong with your transfer. Please try again or contact support.</p>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
} 