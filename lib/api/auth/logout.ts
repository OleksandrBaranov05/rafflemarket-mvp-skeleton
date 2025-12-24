import { http } from "@/lib/utils/http";

export type LogoutResponse = { ok: true };

export function logout() {
  return http<LogoutResponse>("/api/auth/logout", { method: "POST" });
}
