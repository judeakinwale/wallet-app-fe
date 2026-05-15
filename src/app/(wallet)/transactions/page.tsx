"use client";
import React, { useMemo, useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useGetItems } from "@/hooks";
import { Transaction, TransactionType } from "@/types/transaction";
import { formatCurrency } from "@/utils";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const TYPE_STYLES: Record<string, { container: string; text: string }> = {
  deposit: { container: "bg-green-100", text: "text-green-800" },
  withdrawal: { container: "bg-red-100", text: "text-red-800" },
  transfer: { container: "bg-yellow-100", text: "text-yellow-800" },
};

function resolveDisplayType(tx: Transaction, userId?: number): TransactionType {
  return tx.type;
}

const columns: (userId?: number) => ColumnDef<Transaction>[] = (userId) => [
  {
    key: "type",
    header: "Type",
    accessor: (tx) => {
      const display = resolveDisplayType(tx, userId);
      const styles = TYPE_STYLES[display] ?? TYPE_STYLES.transfer;
      return (
        <span
          className={cn(
            "rounded px-2 py-0.5 text-xs font-medium capitalize",
            styles.container,
            styles.text,
          )}
        >
          {display}
        </span>
      );
    },
  },
  {
    key: "from",
    header: "From",
    accessor: (tx) => tx.fromWallet?.name ?? "—",
  },
  {
    key: "to",
    header: "To",
    accessor: (tx) =>
      tx.toWallet
        ? `${tx.toWallet.user?.name ?? ""} [${tx.toWallet.name}]`.trim()
        : "—",
  },
  {
    key: "amount",
    header: "Amount",
    accessor: (tx) => {
      const display = resolveDisplayType(tx, userId);
      const styles = TYPE_STYLES[display] ?? TYPE_STYLES.transfer;
      return (
        <span className={cn("font-medium", styles.text)}>
          {formatCurrency(tx.amount)}
        </span>
      );
    },
    className: "text-right",
    headerClassName: "text-right",
  },
  {
    key: "date",
    header: "Date",
    accessor: (tx) => new Date(tx.createdAt).toLocaleString(),
    className: "text-sm text-muted-foreground whitespace-nowrap",
  },
];

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const walletIds = useMemo(
    () => (user?.wallets ?? []).map((w) => w.id),
    [user?.wallets],
  );
  const walletIdsStr = walletIds.join(",");

  const { data: transactions = [], isLoading } = useGetItems<Transaction>(
    `/transaction/wallet/${walletIdsStr}`,
    undefined,
    { enabled: walletIds.length > 0 },
  );

  const sorted = useMemo(
    () =>
      [...transactions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [transactions],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-xl font-semibold">Transactions</h2>

      <DataTable
        columns={columns(user?.id)}
        data={paginated}
        keyExtractor={(tx) => tx.id}
        isLoading={isLoading}
        emptyMessage="No transactions found."
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
