import { cookies } from "next/headers";
import * as crypto from "crypto";

const COOKIE_NAME = "rm_session";
const SECRET = process.env.SESSION_SECRET || "dev_secret_change_me";

export type SessionUser = {
  id: string;
  email: string;
  role: "user" | "seller" | "admin";
  name?: string;
  avatarUrl?: string;
  canSell?: boolean; // Можливість продавати (перемикач в профілі)
  balance?: number; // Баланс користувача в гривнях
};

export type Session = {
  user: SessionUser;
};

function sign(payloadB64: string) {
  return crypto.createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

export function createSessionCookie(session: Session) {
  const payloadB64 = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function parseSessionCookie(value: string): Session | null {
  const [payloadB64, sig] = value.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    return JSON.parse(json) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return parseSessionCookie(raw);
}

export const sessionCookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
