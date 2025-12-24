import { http } from "@/lib/utils/http";

export type MeResponse =
  | { user: { id: string; email: string; role: "user" | "seller" | "admin"; name?: string; avatarUrl?: string } }
  | { user: null };

export function me() {
  return http<MeResponse>("/api/auth/me", { method: "GET" });
}
