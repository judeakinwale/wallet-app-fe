"use client";
import React from "react";
import { queryClient } from "@/constants/reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>{children}</div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
