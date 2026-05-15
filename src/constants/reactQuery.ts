import { QueryClient } from "@tanstack/react-query";

export const TRANSACTION_CACHE_KEY = "wallet_transactions";
export const TRANSACTION_TTL = 6 * 60 * 1000; // 6 minutes
export const QUERY_KEYS = {
  user: "user",
  wallet: "wallet",
  transaction: "transaction",
  singleWallet: (walletId: number) => ["wallet", walletId] as const,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 6000,
      gcTime: 9000,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});
