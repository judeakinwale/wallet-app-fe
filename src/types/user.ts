import type { Wallet } from "./wallet";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  wallets?: Wallet[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse extends User {
  token: string;
  tokenExpiresAt?: number; // Unix timestamp in seconds
}
