"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields";
import { useAuth } from "@/context/auth-context";
import { useIsMutating } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const isMutating = useIsMutating({ mutationKey: ["/auth/login"] }) > 0;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleSubmit(values: LoginFormValues) {
    login(values);
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-8 border p-6 rounded shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
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

            <Button type="submit" className="w-full mt-1" disabled={isMutating}>
              {isMutating ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
