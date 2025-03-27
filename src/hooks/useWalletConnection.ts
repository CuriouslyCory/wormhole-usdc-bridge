"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

/**
 * Custom hook to handle wallet connection functionality
 */
export function useWalletConnection() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  /**
   * Connect to wallet using the specified connector or default to the first available
   * @param connectorId Optional connector ID to use (defaults to first available)
   */
  const connectWallet = async (connectorId?: string) => {
    try {
      const targetConnector = connectorId 
        ? connectors.find(c => c.id === connectorId)
        : connectors[0];
      
      if (targetConnector) {
        connect({ connector: targetConnector });
      } else {
        throw new Error("No wallet connectors available");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      throw new Error("Failed to connect wallet. Please try again.");
    }
  };

  /**
   * Disconnect the currently connected wallet
   */
  const disconnectWallet = () => {
    if (isConnected) {
      disconnect();
    }
  };

  /**
   * Format address for display (e.g., 0x1234...5678)
   */
  const formatAddress = (addr: string | undefined = address) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    address,
    isConnected,
    chain,
    isPending,
    connectors,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
} 