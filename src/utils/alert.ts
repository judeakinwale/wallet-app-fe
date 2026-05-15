import { toast } from "sonner";

export const successAlert = (message: string) => {
  toast.success(message);
};

export const errorAlert = (message: string) => {
  toast.error(message);
};
