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
import { successAlert } from "@/utils";

type WithdrawFormProps = {
  walletId: number;
  walletBalance?: number;
  onSuccess?: () => void;
};

const WithdrawForm: React.FC<WithdrawFormProps> = ({
  walletId,
  walletBalance = 0,
  onSuccess,
}) => {
  const { refetchUser } = useAuth();

  const withdrawSchema = z.object({
    amount: z
      .number()
      .max(walletBalance, "Amount must be less than or equal to wallet balance")
      .positive("Amount must be greater than 0"),
  });
  type WithdrawFormValues = z.infer<typeof withdrawSchema>;

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: 0 },
  });

  const { mutateAsync: withdrawAsync, isPending } = useCreateItem(
    `/wallet/${walletId}/withdraw`,
    false,
  );

  function handleSubmit(values: WithdrawFormValues) {
    values = { ...values, amount: values.amount * 100 }; // convert to kobo
    withdrawAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
        refetchUser?.();
        successAlert("Withdrawal successful!");
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
          label="Amount (₦)"
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
