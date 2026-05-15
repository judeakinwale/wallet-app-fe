export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined" || !document?.cookie) return undefined;

  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return undefined;
};

export const getToken = () => {
  let token = getCookie("access_token");
  if (typeof window === "undefined") return token;

  token ||= localStorage.getItem("token") ?? undefined;
  return token;
};

export const jsonHeaders = {
  "Content-Type": "application/json",
};

export const getJsonHeaders = (token?: string) => {
  token ||= getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const formDataHeaders = {
  "Content-Type": "multipart/form-data",
};

export const getFormDataHeaders = (token?: string) => {
  token ||= getToken();
  return {
    "Content-Type": "multipart/form-data",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
