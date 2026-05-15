"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DEFAULT_AUTHENTICATED_ROUTE } from "@/constants/routes";
import { errorAlert } from "@/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields";
import { useCreateItem } from "@/hooks";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutateAsync: registerAsync, isPending } =
    useCreateItem("/auth/register");

  function handleSubmit(values: RegisterFormValues) {
    const { confirmPassword: _, ...payload } = values;
    registerAsync(payload, {
      onSuccess: (data) => {
        document.cookie = `access_token=${data.token}; path=/; SameSite=Lax`;
        router.push(DEFAULT_AUTHENTICATED_ROUTE);
      },
      onError: (error: Error) => {
        errorAlert(error.message || "Registration failed. Please try again.");
      },
    });
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-8 border p-6 rounded shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <InputField
              control={form.control}
              name="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
            />
            <InputField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <InputField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <InputField
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full mt-1" disabled={isPending}>
              {isPending ? "Creating account…" : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
