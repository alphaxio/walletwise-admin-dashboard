import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";

import { installActionOtpInterceptor, isActionOtpError, setActionOtpHandler } from "./actionOtp";

// A fake API: wants code 123456 for POST /wallet-adjustments, nothing else needs one.
const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const reply = (status: number, data: unknown) => {
    const res = { status, data, statusText: "", headers: {}, config };
    if (status >= 400) throw new AxiosError("fail", String(status), config, null, res);
    return res;
  };
  if (config.url !== "/wallet-adjustments") return reply(200, { ok: true });
  const code = config.headers.get("X-Action-OTP");
  if (!code) return reply(428, { code: "OTP_REQUIRED", data: { action: "wallet_adjustment", resourceId: null } });
  if (code !== "123456") return reply(400, { code: "OTP_INVALID", message: "Wrong approval code" });
  return reply(201, { saved: JSON.parse(config.data) });
};

const makeClient = () => {
  const client = axios.create({ adapter, headers: { "Content-Type": "application/json" } });
  installActionOtpInterceptor(client);
  return client;
};

afterEach(() => setActionOtpHandler(null));

describe("action OTP interceptor", () => {
  it("leaves requests that need no code alone", async () => {
    const client = makeClient();
    let asked = false;
    setActionOtpHandler(async () => {
      asked = true;
      throw new Error("not expected");
    });
    expect((await client.get("/rates")).data).toEqual({ ok: true });
    expect(asked).toBe(false);
  });

  it("asks for a code and retries the same request with it", async () => {
    const client = makeClient();
    let seen: { action: string; body: unknown } | null = null;
    setActionOtpHandler(async (prompt) => {
      seen = { action: prompt.action, body: prompt.body };
      await expect(prompt.submit("000000")).rejects.toSatisfy(isActionOtpError);
      return prompt.submit("123456");
    });
    const res = await client.post("/wallet-adjustments", { amount: 5000, kind: "credit" });
    expect(res.status).toBe(201);
    expect(res.data.saved).toEqual({ amount: 5000, kind: "credit" });
    expect(seen).toEqual({ action: "wallet_adjustment", body: { amount: 5000, kind: "credit" } });
  });

  it("fails with the original error when the admin cancels", async () => {
    const client = makeClient();
    setActionOtpHandler(() => Promise.reject());
    await expect(client.post("/wallet-adjustments", { amount: 1 })).rejects.toMatchObject({ response: { status: 428 } });
  });

  it("fails as before when no dialog is mounted", async () => {
    const client = makeClient();
    await expect(client.post("/wallet-adjustments", { amount: 1 })).rejects.toMatchObject({ response: { status: 428 } });
  });
});
