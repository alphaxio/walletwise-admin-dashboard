import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Approval codes for sensitive actions (wallet adjustment, settlement sweep, rate changes).
 *
 * When the API answers 428 OTP_REQUIRED, the request is paused, the approval dialog opens,
 * and the same request is sent again with the code in the X-Action-OTP header. The screen
 * that made the request just sees it succeed (or fail) as usual.
 */

export type ActionOtpPrompt = {
  action: string;
  resourceId: string | null;
  body: unknown;
  /** Re-sends the original request with this code. */
  submit: (code: string) => Promise<AxiosResponse>;
};

type Handler = (prompt: ActionOtpPrompt) => Promise<AxiosResponse>;

let handler: Handler | null = null;

/** The approval dialog registers itself here while it is mounted. */
export const setActionOtpHandler = (next: Handler | null) => {
  handler = next;
};

type RetriableConfig = InternalAxiosRequestConfig & { _actionOtp?: boolean };

const parseBody = (data: unknown) => {
  if (typeof data !== "string") return data ?? {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

/** True for the API's approval code errors (wrong, expired, used, ...). */
export const isActionOtpError = (error: unknown) => {
  const code = (error as AxiosError<{ code?: string }>)?.response?.data?.code;
  return typeof code === "string" && code.startsWith("OTP_");
};

export const installActionOtpInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(undefined, (error: AxiosError<{ code?: string; data?: { action?: string; resourceId?: string | null } }>) => {
    const config = error.config as RetriableConfig | undefined;
    const res = error.response;
    if (!config || config._actionOtp || res?.status !== 428 || res.data?.code !== "OTP_REQUIRED" || !handler) {
      return Promise.reject(error);
    }
    return handler({
      action: res.data?.data?.action ?? "",
      resourceId: res.data?.data?.resourceId ?? null,
      body: parseBody(config.data),
      submit: (code) => {
        const retry: RetriableConfig = { ...config, _actionOtp: true };
        retry.headers.set("X-Action-OTP", code);
        return instance.request(retry);
      },
    }).catch((reason) => Promise.reject(reason ?? error));
  });
};
