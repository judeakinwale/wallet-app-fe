"use client";
import React from "react";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
} from "@/constants/routes";
import { useCreateItem, useGetItem } from "@/hooks";
import { LoginPayload, LoginResponse, User } from "@/types/user";
import { errorAlert } from "@/utils";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  user?: User;
  login: (payload: LoginPayload) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: undefined,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>();

  const { mutateAsync: loginAsync, isPending } =
    useCreateItem<LoginResponse>("/auth/login");

  const { refetch } = useGetItem<User>("/auth/me");

  const login = (payload: LoginPayload) => {
    loginAsync(payload, {
      onSuccess: (data: LoginResponse) => {
        document.cookie = `access_token=${data.token}; path=/; SameSite=Lax`;
        router.push(DEFAULT_AUTHENTICATED_ROUTE);
      },
      onError: (error: Error) => {
        errorAlert(error.message || "Login failed. Please try again.");
      },
    });
    refetch().then(({ data }) => {
      if (data) {
        setIsAuthenticated(true);
        setUser(data);
      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.push(DEFAULT_UNAUTHENTICATED_ROUTE);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
