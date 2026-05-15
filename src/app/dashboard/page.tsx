/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { WalletIcon } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { useGetItem, useGetItems } from "@/hooks";
import { cn } from "@/lib/utils";
import Modal from "@/components/common/modal";
import TransferForm from "@/modules/wallet/forms/transfer-form";
import DepositForm from "@/modules/wallet/forms/deposit-form";
import WithdrawForm from "@/modules/wallet/forms/withdraw-form";
import { useTransactionStore } from "@/store/useTransactionStore";
import { User } from "@/types/user";
import { formatCurrency } from "@/utils";

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const { user } = useAuth();

  let containerClassName = "bg-yellow-100";
  let amountClassName = "text-yellow-800";
  const createdAt = new Date(tx.createdAt).toLocaleString();

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

  const displayArrow = (txType: typeof txDisplayType) => {
    if (txType === "deposit") return <>&larr;</>;
    if (txType === "withdrawal") return <>&rarr;</>;
    return <>&harr;</>;
  };

  return (
    <div className={cn(containerClassName)}>
      <div className="flex items-center justify-between gap-4 px-3 py-2">
        <span className="flex gap-2 text-xs">
          {tx.fromWallet?.name} {displayArrow(txDisplayType)}{" "}
          {tx.toWallet?.user?.name} [{tx.toWallet?.name}]
        </span>
        <span className="text-xs text-primary ">{tx.type}</span>
        <div className="flex flex-col gap-0.5">
          <span className={cn(amountClassName)}>
            {formatCurrency(tx.amount)}
          </span>
          <span className="text-xs">{createdAt}</span>
        </div>
      </div>
      <div className="flex items-center gap-4"></div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const storedTx = useTransactionStore((state) => state.transactions);
  const setStoredTx = useTransactionStore((state) => state.setTransactions);
  const addTxToStore = useTransactionStore((state) => state.addTransaction); // for websockets

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const wallets = (mounted ? user?.wallets : null) || [];
  const walletIds = wallets.map((w) => w.id);
  const walletIdsStr = walletIds.join(",");
  const firstWalletId = walletIds[0];

  const [selectedWallet, setSelectedWallet] = useState<number>(firstWalletId);
  const [modalOpen, setModalOpen] = useState({
    transfer: false,
    deposit: false,
    withdraw: false,
  });

  // to refetch the data in auth context
  const { data: me } = useGetItem<User>("/auth/me", false, undefined, {
    enabled: !!user?.id,
  });

  // get transactions for the users wallets
  const { data: transactions = storedTx, refetch: refetchTx } =
    useGetItems<Transaction>(`/transaction/wallet/${walletIdsStr}`, undefined, {
      enabled: walletIds.length > 0,
    });

  const walletTransactions = useMemo(() => {
    if (!transactions?.length) return [];
    if (!selectedWallet) return [];

    return transactions.filter(
      (tx) =>
        tx.fromWalletId === selectedWallet || tx.toWalletId === selectedWallet,
    );
  }, [transactions, selectedWallet]);

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

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

  const toggleModal = (type: keyof typeof modalOpen, value?: boolean) => () => {
    setModalOpen((prev) => ({ ...prev, [type]: value ?? !prev[type] }));
    refetchTx();
  };

  useEffect(() => {
    if (!firstWalletId) return;
    if (selectedWallet) return;
    setSelectedWallet(firstWalletId);
  }, [firstWalletId, selectedWallet]);

  useEffect(() => {
    if (!transactions?.length) return;
    // if (storedTx?.length) return;
    setStoredTx(transactions);
  }, [transactions, setStoredTx]);

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* dashboard btns */}
      <div className="flex items-center justify-end gap-4">
        <Modal
          open={modalOpen.transfer}
          onOpenChange={toggleModal("transfer")}
          trigger={
            <div className="px-3 py-1.5 bg-primary text-secondary rounded">
              Transfer
            </div>
          }
          title={"Transfer"}
          body={
            <TransferForm
              walletId={selectedWallet}
              walletBalance={selectedWalletData?.balance}
              onSuccess={toggleModal("transfer")}
            />
          }
        />
        <Modal
          open={modalOpen.deposit}
          onOpenChange={toggleModal("deposit")}
          trigger={
            <div className="px-3 py-1.5 text-primary border border-primary rounded">
              Deposit
            </div>
          }
          title={"Deposit"}
          body={
            <DepositForm
              walletId={selectedWallet}
              onSuccess={toggleModal("deposit")}
            />
          }
        />
        <Modal
          open={modalOpen.withdraw}
          onOpenChange={toggleModal("withdraw")}
          trigger={
            <div className="px-3 py-1.5 bg-secondary text-primary rounded">
              Withdraw{" "}
            </div>
          }
          title={"Withdraw "}
          body={
            <WithdrawForm
              walletId={selectedWallet}
              walletBalance={selectedWalletData?.balance}
              onSuccess={toggleModal("withdraw")}
            />
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        {/* dashboard cards */}
        <div className="w-full space-y-4">
          <h3 className="text-lg">Wallets</h3>
          <div className="flex gap-4 flex-wrap">
            {wallets?.map((wallet) => (
              <DashboardCard
                key={wallet.id}
                title={wallet.name}
                value={formatCurrency(wallet.balance)}
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
