import type { Transaction } from "./transaction";
import { User } from "./user";

export type Wallet = {
  id: number;
  name: string;
  email: string;
  balance: number;
  userId?: number;
  user?: User;
  sentTransactions?: Transaction[];
  receivedTransactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
};
