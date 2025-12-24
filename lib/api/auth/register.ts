import { http } from "@/lib/utils/http";

export type RegisterInput = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  ok: true;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export function register(input: RegisterInput) {
  return http<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

