export const formatCurrency = (
  amount: number,
  currency: string = "NGN",
  isSubUnit: boolean = true,
): string => {
  amount = isSubUnit ? amount / 100 || 0 : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};
