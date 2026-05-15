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

const depositSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
});

type DepositFormValues = z.infer<typeof depositSchema>;

type DepositFormProps = {
  walletId: number;
  onSuccess?: () => void;
};

const DepositForm: React.FC<DepositFormProps> = ({ walletId, onSuccess }) => {
  const { refetchUser } = useAuth();
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: 0 },
  });

  const { mutateAsync: depositAsync, isPending } = useCreateItem(
    `/wallet/${walletId}/deposit`,
    false,
  );

  function handleSubmit(values: DepositFormValues) {
    depositAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
        refetchUser?.();
        successAlert("Deposit successful!");
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
          {isPending ? "Depositing…" : "Deposit"}
        </Button>
      </form>
    </Form>
  );
};

export default DepositForm;
