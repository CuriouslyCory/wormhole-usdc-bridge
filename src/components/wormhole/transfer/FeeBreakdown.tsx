"use client";

interface FeeBreakdownProps {
  sourceChainFee: string;
  destinationChainFee: string;
  bridgeFee: string;
  totalFee: string;
  finalAmount: string;
}

export function FeeBreakdown({
  sourceChainFee,
  destinationChainFee,
  bridgeFee,
  totalFee,
  finalAmount,
}: FeeBreakdownProps) {
  return (
    <div className="rounded-md border bg-card/50 p-4">
      <h3 className="mb-2 font-medium">Fee Breakdown</h3>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Source Chain Gas</span>
          <span>{sourceChainFee} USDC</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Destination Chain Gas</span>
          <span>{destinationChainFee} USDC</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bridge Fee</span>
          <span>{bridgeFee} USDC</span>
        </div>
        
        <div className="my-2 border-t pt-2" />
        
        <div className="flex justify-between font-medium">
          <span>Total Fees</span>
          <span>{totalFee} USDC</span>
        </div>
        
        <div className="flex justify-between text-base font-bold">
          <span>You Will Receive</span>
          <span>{finalAmount} USDC</span>
        </div>
      </div>
    </div>
  );
} 