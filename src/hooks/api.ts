/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "@/constants/api";
import {
  getFormDataHeaders,
  getJsonHeaders,
  errorAlert,
  successAlert,
} from "../utils";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

type id = string | number;

interface MessageOptions {
  hideSuccessMessage?: boolean;
  hideErrorMessage?: boolean;
}

export const getItems = async (relativeUrl: string) => {
  const url = `${API_BASE_URL}${relativeUrl}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getJsonHeaders(),
    // credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        response.statusText ||
        "Error contacting server",
    );
  }

  if (!data?.success)
    throw new Error(data?.error || data?.message || "Error contacting server");

  const sortFn = (a: any, b: any) =>
    new Date(b.Modified).getTime() - new Date(a.Modified).getTime();
  return data.data?.sort(sortFn);
};

export const getItem = async (relativeUrl: string, id?: id | false) => {
  const url = `${API_BASE_URL}${relativeUrl}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getJsonHeaders(),
    // credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        response.statusText ||
        "Error contacting server",
    );
  }

  if (!data?.success)
    throw new Error(data?.error || data?.message || "Error contacting server");

  return data.data;
};

export const createItem = async (relativeUrl: string, formData: any) => {
  const url = `${API_BASE_URL}${relativeUrl}`;

  const formDataKeys = Object.keys(formData);
  const isFormData = formDataKeys.some((k: any) => {
    if (Array.isArray(formData[k])) {
      return formData[k].some((item: any) => item instanceof File);
    }
    return formData[k] instanceof File;
  });

  const formDataPayload = new FormData();
  formDataKeys.map((k) => {
    if (Array.isArray(formData[k])) {
      return formData[k].forEach((item: any) =>
        formDataPayload.append(k, item),
      );
    }
    return formDataPayload.append(k, formData[k]);
  });

  const response = await fetch(url, {
    method: "POST",
    body: isFormData ? formDataPayload : JSON.stringify(formData),
    headers: isFormData ? getFormDataHeaders() : getJsonHeaders(),
    // credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        response.statusText ||
        "Error contacting server",
    );
  }

  if (!data?.success)
    throw new Error(data?.error || data?.message || "Error contacting server");

  return data.data;
};

export const updateItem = async (
  relativeUrl: string,
  formData: any,
  id?: id | false,
  shouldUpdateURLWithId: boolean = true,
) => {
  const updatedRelativeUrl = shouldUpdateURLWithId
    ? `${relativeUrl}/${id || ""}`
    : relativeUrl;
  console.log({ updatedRelativeUrl });
  const url = `${API_BASE_URL}${updatedRelativeUrl}`;

  const formDataKeys = Object.keys(formData);
  const isFormData = formDataKeys.some((k: any) => formData[k] instanceof File);

  const formDataPayload = new FormData();
  formDataKeys.map((k) => formDataPayload.append(k, formData[k]));

  const response = await fetch(url, {
    method: "PATCH",
    body: isFormData ? formDataPayload : JSON.stringify(formData),
    headers: isFormData ? getFormDataHeaders() : getJsonHeaders(),
    // credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        response.statusText ||
        "Error contacting server",
    );
  }

  if (!data?.success)
    throw new Error(data?.error || data?.message || "Error contacting server");

  return data.data;
};

export const deleteItem = async (relativeUrl: string, id?: id | false) => {
  const url = `${API_BASE_URL}${relativeUrl}/${id || ""}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: getJsonHeaders(),
    // credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        response.statusText ||
        "Error contacting server",
    );
  }

  if (!data?.success)
    throw new Error(data?.error || data?.message || "Error contacting server");

  return data;
};

export const useGetItems = <T>(relativeUrl: string, placeholder?: T[]) => {
  return useQuery<T[]>({
    placeholderData: placeholder,
    queryFn: async () => await getItems(relativeUrl),
    queryKey: [relativeUrl],
  });
};

export const useGetItem = <T>(
  relativeUrl: string,
  id?: id | false,
  placeholder?: any,
  extraArgs?: Partial<UseQueryOptions<T, any, any, QueryKey>>,
) => {
  return useQuery<T>({
    placeholderData: placeholder,
    queryFn: async () => await getItem(relativeUrl, id),
    queryKey: [relativeUrl, id],
    ...extraArgs,
  });
};

export const useCreateItem = <T>(
  relativeUrl: string,
  successMessage?: string | false,
  messageOptions?: MessageOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      await createItem(relativeUrl, payload),
    mutationKey: [relativeUrl],
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [relativeUrl] });

      if (!messageOptions?.hideSuccessMessage && successMessage !== false) {
        const msg = successMessage
          ? successMessage
          : "Item created successfully";
        successAlert(msg);
      }
    },
    onError(error, variables, context) {
      errorAlert(
        (error as any)?.message ||
          "An error occurred while submitting your request. Please try again.",
      );
    },
  });
};

export const useCreateMultipleItems = <T>(
  relativeUrl: string,
  successMessage?: string | false,
  messageOptions?: MessageOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payloadList: Record<string, any>[]) => {
      const res = await Promise.all(
        payloadList?.map(async (payload) => {
          return createItem(relativeUrl, payload);
        }),
      );
      return res;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [relativeUrl] });

      if (!messageOptions?.hideSuccessMessage && successMessage !== false) {
        const msg = successMessage
          ? successMessage
          : "Items created successfully";
        successAlert(msg);
      }
    },
    onError(error, variables, context) {
      errorAlert(
        (error as any)?.message ||
          "An error occurred while submitting your request. Please try again.",
      );
    },
  });
};

export const useUpdateItem = <T>(
  relativeUrl: string,
  id?: id | false,
  successMessage?: string | false,
  messageOptions?: MessageOptions,
  shouldUpdateURLWithId: boolean = true,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) =>
      await updateItem(
        relativeUrl,
        payload,
        id || payload?._id || payload?.ID || payload?.get("_id"),
        shouldUpdateURLWithId,
      ),
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [relativeUrl] });

      if (!messageOptions?.hideSuccessMessage && successMessage !== false) {
        const msg = successMessage
          ? successMessage
          : "Item updated successfully";
        successAlert(msg);
      }
    },
    onError(error, variables, context) {
      errorAlert(
        (error as any)?.message ||
          "An error occurred while submitting your request. Please try again.",
      );
    },
  });
};

export const useDeleteItem = <T>(
  relativeUrl: string,
  successMessage?: string | false,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id?: id | false) => await deleteItem(relativeUrl, id),
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [relativeUrl] });

      const msg = successMessage ? successMessage : "Item deleted successfully";
      successAlert(msg);
    },
    onError(error, variables, context) {
      errorAlert(
        (error as any)?.message ||
          "An error occurred while submitting your request. Please try again.",
      );
    },
  });
};
