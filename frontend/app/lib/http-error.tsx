import axios, { AxiosError } from "axios";

export type BackendErrorShape = {
  message?: string;
  errors?: Record<string, string[] | string>;
  [key: string]: unknown;
};

function extractErrorMessages(data: BackendErrorShape | undefined): string[] {
  if (!data) return ["Something went wrong. Please try again."];

  const messages: string[] = [];

  if (typeof data.message === "string" && data.message.trim() !== "") {
    messages.push(data.message);
  }

  if (data.errors && typeof data.errors === "object") {
    Object.values(data.errors).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((msg) => {
          if (typeof msg === "string" && msg.trim() !== "") {
            messages.push(msg);
          }
        });
      } else if (typeof val === "string" && val.trim() !== "") {
        messages.push(val);
      }
    });
  }

  return messages.length > 0
    ? messages
    : ["Bad input data. Please check your fields."];
}

/**
 * Turn any error (Axios or not) into a list of user-friendly messages.
 * You can override invalidCredentialsMessage / defaultMessage per usage.
 */
export function getErrorMessagesFromError(
  err: unknown,
  opts: {
    invalidCredentialsMessage?: string;
    defaultMessage?: string;
  } = {}
): string[] {
  const {
    invalidCredentialsMessage = "Bad credentials. Please check your email and password.",
    defaultMessage = "Something went wrong. Please try again.",
  } = opts;

  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<BackendErrorShape>;
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    if (status === 401) {
      const msg =
        (data?.message && typeof data.message === "string" && data.message) ||
        invalidCredentialsMessage;
      return [msg];
    }

    if (status === 422) {
      return extractErrorMessages(data);
    }

    if (data?.message && typeof data.message === "string") {
      return [data.message];
    }

    return [defaultMessage];
  }

  // Non-Axios / unknown
  return ["Unexpected error. Please try again."];
}
