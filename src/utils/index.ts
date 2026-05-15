/* eslint-disable @typescript-eslint/no-explicit-any */
export { successAlert, errorAlert } from "./alert";
export {
  jsonHeaders,
  formDataHeaders,
  getJsonHeaders,
  getFormDataHeaders,
} from "./fetch";
export { formatCurrency } from "./format";

export function tryParse<T>(
  data?: string,
  defaultResponse?: T,
): T | typeof defaultResponse {
  if (!data) return defaultResponse;
  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.log("Parsing JSON failed:: ", (err as Error).message);
    return defaultResponse;
  }
}

export function tryStringify<T>(
  data?: T,
  defaultResponse?: string,
): string | typeof defaultResponse {
  if (!data) return defaultResponse;
  try {
    return JSON.stringify(data);
  } catch (err) {
    console.log("Stringifying data failed: ", (err as Error).message);
    return defaultResponse;
  }
}
