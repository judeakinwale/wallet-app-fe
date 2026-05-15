export const useLocalStorage = (): Storage | undefined => {
  if (typeof window === "undefined") {
    console.error("useLocalStorage can only be used in the browser");
    return undefined;
  }
  return localStorage;
};
