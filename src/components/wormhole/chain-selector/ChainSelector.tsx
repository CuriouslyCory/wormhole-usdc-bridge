"use client";

import { useState } from "react";

import { type ChainId } from "~/lib/wormhole/types";
import { getSupportedChains } from "~/lib/wormhole/chains";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

interface ChainSelectorProps {
  selectedChain: ChainId | "";
  onChainSelect: (chain: ChainId) => void;
  disabledChains?: ChainId[];
}

export function ChainSelector({ 
  selectedChain, 
  onChainSelect, 
  disabledChains = [] 
}: ChainSelectorProps) {
  const [open, setOpen] = useState(false);
  const chains = getSupportedChains();
  
  // Get details of the selected chain for display purposes
  const selectedChainDetails = selectedChain 
    ? chains.find((chain) => chain.id === selectedChain) 
    : undefined;
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          {selectedChainDetails ? (
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-gray-100/10">
                {/* In a real app, this would be an actual chain icon */}
                {selectedChainDetails.icon && (
                  <span className="sr-only">{selectedChainDetails.name} icon</span>
                )}
              </span>
              <span>{selectedChainDetails.name}</span>
            </div>
          ) : (
            <span>Select a chain</span>
          )}
          <span className="ml-2 shrink-0 opacity-50">▼</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {chains.map((chain) => {
          const isDisabled = disabledChains.includes(chain.id);
          
          return (
            <DropdownMenuItem
              key={chain.id}
              className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onSelect={() => {
                if (!isDisabled) {
                  onChainSelect(chain.id);
                  setOpen(false);
                }
              }}
              disabled={isDisabled}
            >
              <span className="h-5 w-5 shrink-0 rounded-full bg-gray-100/10">
                {/* In a real app, this would be an actual chain icon */}
                {chain.icon && (
                  <span className="sr-only">{chain.name} icon</span>
                )}
              </span>
              <span>{chain.name}</span>
              {chain.supportsCCTP && (
                <span className="ml-auto rounded-full bg-green-100/10 px-2 py-0.5 text-[10px] text-green-700">
                  Native USDC
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 