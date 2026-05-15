export interface GenericItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T = GenericItem> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}
