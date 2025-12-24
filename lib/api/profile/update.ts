import { http } from "@/lib/utils/http";

export type UpdateProfileInput = {
  name?: string;
  avatarUrl?: string; // base64 string або URL
  canSell?: boolean; // Перемикач режиму продавця
};

export type UpdateProfileResponse = {
  ok: true;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role: string;
    canSell?: boolean;
  };
};

export function updateProfile(input: UpdateProfileInput) {
  return http<UpdateProfileResponse>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

