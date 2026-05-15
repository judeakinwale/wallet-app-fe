import type { Wallet } from './wallet';

export type TransactionType = 'transfer' | 'deposit' | 'withdrawal';

export type Transaction = {
  id: number;
  amount: number;
  fromWalletId?: number;
  fromWallet?: Wallet;
  toWalletId?: number;
  toWallet?: Wallet;
  type: TransactionType;
  details?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
