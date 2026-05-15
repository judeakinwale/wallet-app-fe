"use client";
import React, { useEffect } from "react";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
} from "@/constants/routes";
import { useCreateItem, useGetItem, useLocalStorage } from "@/hooks";
import { LoginPayload, LoginResponse, User } from "@/types/user";
import { errorAlert, successAlert, tryParse, tryStringify } from "@/utils";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  user?: User;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  refetchUser?: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: undefined,
  login: () => {},
  logout: () => {},
  refetchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const storage = useLocalStorage();
  const storedUser = tryParse<User>(storage?.getItem("user") as string);

  const { data: me = storedUser, refetch } = useGetItem<User>("/auth/me");

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>(me);

  const { mutateAsync: loginAsync, isPending } = useCreateItem<LoginResponse>(
    "/auth/login",
    false,
  );

  const login = (payload: LoginPayload) => {
    loginAsync(payload, {
      onSuccess: (data: LoginResponse) => {
        const expiresIn = data.tokenExpiresAt
          ? data.tokenExpiresAt - Math.floor(Date.now() / 1000)
          : 86400; // Calculate max-age in seconds with 1 day default

        // document.cookie = `access_token=${data.token}; path=/; SameSite=Lax; Secure; max-age=${expiresIn}`;
        document.cookie = `access_token=${data.token}; path=/; SameSite=Lax; max-age=${expiresIn}`;

        router.push(DEFAULT_AUTHENTICATED_ROUTE);
        successAlert("Login successful! Redirecting...");

        storage?.setItem("token", data.token);
      },
      onError: (error: Error) => {
        errorAlert(error.message || "Login failed. Please try again.");
      },
    });
    refetch().then(({ data }) => {
      if (data) {
        setIsAuthenticated(true);
        setUser(data);
        storage?.setItem("user", tryStringify(data)!);
      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    storage?.removeItem("user");
    storage?.removeItem("token");

    router.push(DEFAULT_UNAUTHENTICATED_ROUTE);
  };

  useEffect(() => {
    if (!me) return;
    setUser(me);
  }, [me]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, refetchUser: refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
