"use client";
import React, { useState } from "react";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { WalletIcon } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { useGetItem } from "@/hooks";
import { cn } from "@/lib/utils";
import Modal from "@/components/common/modal";
import TransferForm from "@/modules/wallet/forms/transfer-form";
import DepositForm from "@/modules/wallet/forms/deposit-form";
import WithdrawForm from "@/modules/wallet/forms/withdraw-form";
import { useTransactionStore } from "@/store/useTransactionStore";

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const { user } = useAuth();

  let containerClassName = "bg-yellow-100";
  let amountClassName = "text-yellow-800";

  let txDisplayType = tx.type;
  if (tx.type === "transfer") {
    txDisplayType =
      tx.fromWallet?.userId === user?.id ? "withdrawal" : "deposit";
  }

  switch (txDisplayType) {
    case "deposit":
      containerClassName = "bg-green-100";
      amountClassName = "text-green-800";
      break;
    case "withdrawal":
      containerClassName = "bg-red-100";
      amountClassName = "text-red-800";
      break;
  }

  return (
    <div className={cn(containerClassName)}>
      <div className="flex items-center justify-between gap-4 px-3 py-2">
        <span>
          {tx.fromWallet?.name} &rarr; {tx.toWallet?.user?.name} [
          {tx.toWallet?.name}]
        </span>
        <span className={cn(amountClassName)}>₦ {tx.amount}</span>
      </div>
      <div className="flex items-center gap-4"></div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const storedTx = useTransactionStore((state) => state.transactions);

  const wallets = user?.wallets || [];
  const firstWalletId = wallets[0]?.id;

  const [selectedWallet, setSelectedWallet] = useState<number>(firstWalletId);

  // to refetch the data in auth context
  const { data: me } = useGetItem("/auth/me");

  // // get matching wallets and user info for recipients
  // const { data: relatedWallets } = useGetItem("/wallets?matchingId");

  const walletTransactions = wallets.flatMap((wallet) => [
    ...(wallet.receivedTransactions || []),
    ...(wallet.sentTransactions || []),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = walletTransactions
    .filter((tx) => {
      return new Date(tx.createdAt).getTime() >= thirtyDaysAgo.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* dashboard btns */}
      <div className="flex items-center justify-end gap-4">
        <Modal
          trigger={<Button variant={"default"}>Transfer</Button>}
          title={"Transfer"}
          body={<TransferForm walletId={selectedWallet} />}
        />
        <Modal
          trigger={<Button variant={"outline"}>Deposit</Button>}
          title={"Deposit"}
          body={<DepositForm walletId={selectedWallet} />}
        />
        <Modal
          trigger={<Button variant={"secondary"}>Withdraw </Button>}
          title={"Withdraw "}
          body={<WithdrawForm walletId={selectedWallet} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        {/* dashboard cards */}
        <div className="w-full space-y-4">
          <h3 className="text-lg">Wallets</h3>
          <div className="flex gap-4 flex-wrap">
            {wallets.map((wallet) => (
              <DashboardCard
                key={wallet.id}
                title={wallet.name}
                value={`₦ ${wallet.balance}`}
                icon={<WalletIcon />}
                onclick={() => setSelectedWallet(wallet.id)}
                isActive={selectedWallet === wallet.id}
              />
            ))}
          </div>
        </div>

        {/* recent transactions */}
        <div className="w-full space-y-4">
          <h3 className="text-lg">Recent Transactions</h3>
          <div className="flex flex-col gap-2">
            {recentTransactions?.map((tx) => {
              return <TransactionItem key={tx.id} tx={tx} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
