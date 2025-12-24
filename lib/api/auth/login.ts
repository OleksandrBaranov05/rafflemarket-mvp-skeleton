import { http } from "@/lib/utils/http";

export type LoginInput = { email: string; password: string };
export type LoginResponse = { ok: true };

export function login(input: LoginInput) {
  return http<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
