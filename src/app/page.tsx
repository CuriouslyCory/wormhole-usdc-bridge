import { TransferForm } from "~/components/wormhole/transfer/TransferForm";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 px-4 py-16">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-white">Wormhole</span>{" "}
            <span className="text-blue-400">USDC Bridge</span>
          </h1>
          
          <div className="max-w-3xl text-center text-lg leading-relaxed text-gray-200">
            <p>
              Securely transfer USDC between supported blockchains, with intelligent routing 
              that automatically selects the best bridging method for your transfer.
            </p>
          </div>
          
          <div className="w-full max-w-lg">
            <TransferForm />
          </div>
          
          <div className="mt-8 flex max-w-3xl flex-col items-center justify-center gap-4 text-center text-sm text-gray-300">
            <p>
              <strong>How It Works:</strong> This bridge intelligently routes your USDC transfer 
              between chains using either Circle&apos;s Cross-Chain Transfer Protocol for native USDC 
              or Wormhole&apos;s Token Bridge for wrapped USDC, depending on chain support.
            </p>
            <p>
              <strong>Security:</strong> All transfers are protected against replay attacks and use 
              Wormhole&apos;s secure Verifiable Action Approvals (VAAs) for cross-chain verification.
            </p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
