"use client";

import { type TransferMethod as TransferMethodType } from "~/lib/wormhole/types";

interface TransferMethodProps {
  method: TransferMethodType;
}

export function TransferMethod({ method }: TransferMethodProps) {
  return (
    <div className="rounded-md bg-secondary/30 p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
          {method === "cctp" ? "🌉" : "🔄"}
        </span>
        <div>
          <p className="font-medium">
            {method === "cctp" ? "Native USDC Transfer (CCTP)" : "Wrapped USDC Transfer (Wormhole)"}
          </p>
          <p className="text-xs text-muted-foreground">
            {method === "cctp"
              ? "Using Circle's Cross-Chain Transfer Protocol for native USDC transfers"
              : "Using Wormhole Token Bridge to move wrapped USDC between chains"}
          </p>
        </div>
      </div>
    </div>
  );
} 