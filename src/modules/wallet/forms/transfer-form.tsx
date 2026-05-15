"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateItem } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields";

const transferSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  recipientWalletId: z
    .number()
    .int()
    .positive("Recipient wallet ID must be a positive integer"),
});

type TransferFormValues = z.infer<typeof transferSchema>;

type TransferFormProps = {
  walletId: number;
  onSuccess?: () => void;
};

const TransferForm: React.FC<TransferFormProps> = ({ walletId, onSuccess }) => {
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: 0, recipientWalletId: 0 },
  });

  const { mutateAsync: transferAsync, isPending } = useCreateItem(
    `/wallet/${walletId}/transfer`,
  );

  function handleSubmit(values: TransferFormValues) {
    transferAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <InputField
          control={form.control}
          name="recipientWalletId"
          label="Recipient Wallet ID"
          type="number"
          placeholder="Enter recipient wallet ID"
          required
        />
        <InputField
          control={form.control}
          name="amount"
          label="Amount"
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
