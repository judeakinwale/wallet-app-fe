"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateItem } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields";
import { useAuth } from "@/context/auth-context";
import { UserSelectField } from "@/components/ui/form-fields/user-select-field";

type TransferFormProps = {
  walletId: number;
  walletBalance?: number;
  onSuccess?: () => void;
};

const TransferForm: React.FC<TransferFormProps> = ({
  walletId,
  walletBalance = 0,
  onSuccess,
}) => {
  const { refetchUser } = useAuth();

  const transferSchema = z.object({
    amount: z
      .number()
      .max(walletBalance, "Amount must be less than or equal to wallet balance")
      .positive("Amount must be greater than 0"),
    recipientWalletId: z
      .number()
      .int()
      .positive("Recipient wallet ID must be a positive integer"),
  });

  type TransferFormValues = z.infer<typeof transferSchema>;

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: 0, recipientWalletId: 0 },
  });

  const { mutateAsync: transferAsync, isPending } = useCreateItem(
    `/wallet/${walletId}/transfer`,
  );

  function handleSubmit(values: TransferFormValues) {
    values = {...values, amount: values.amount * 100} // convert to kobo
    transferAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
        refetchUser?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        {/* <InputField
          control={form.control}
          name="recipientWalletId"
          label="Recipient Wallet ID"
          type="number"
          placeholder="Enter recipient wallet ID"
          required
        /> */}
        <UserSelectField
          control={form.control}
          name="recipientWalletId"
          label="Recipient Wallet"
          placeholder="Search for recipient wallet owner..."
          getValue={(user) => user.wallets?.[0]?.id} // all users have at least 1 wallet
          required
        />
        <InputField
          control={form.control}
          name="amount"
          label="Amount (₦)"
          type="number"
          placeholder="Enter amount"
          required
        />
        <Button type="submit" className="w-full mt-1" disabled={isPending}>
          {isPending ? "Transferring…" : "Transfer"}
        </Button>
      </form>
    </Form>
  );
};

export default TransferForm;
