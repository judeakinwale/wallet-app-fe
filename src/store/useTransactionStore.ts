import { Transaction } from "@/types/transaction";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: state.transactions.concat(transaction),
        })),
    }),
    {
      name: "transaction-history",
    },
  ),
);
