"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateItem } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields";

const withdrawSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

type WithdrawFormProps = {
  walletId: number;
  onSuccess?: () => void;
};

const WithdrawForm: React.FC<WithdrawFormProps> = ({ walletId, onSuccess }) => {
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: 0 },
  });

  const { mutateAsync: withdrawAsync, isPending } = useCreateItem(
    `/wallet/${walletId}/withdraw`,
  );

  function handleSubmit(values: WithdrawFormValues) {
    withdrawAsync(values, {
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
          name="amount"
          label="Amount"
          type="number"
          placeholder="Enter amount"
          required
        />
        <Button type="submit" className="w-full mt-1" disabled={isPending}>
          {isPending ? "Withdrawing…" : "Withdraw"}
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawForm;
