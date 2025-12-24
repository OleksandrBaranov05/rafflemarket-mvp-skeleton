import { NextResponse } from "next/server";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

type Body = { email: string; password: string };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  await sleep(250);

  // Перевірка облікових даних через mockDb
  const user = mockDb.users.verifyCredentials(body.email, body.password);

  if (!user) {
    return NextResponse.json({ message: "Невірний email або пароль" }, { status: 401 });
  }

    const cookieValue = createSessionCookie({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatarUrl: user.avatarUrl,
        canSell: user.canSell,
        balance: user.balance,
      },
    });

  const res = NextResponse.json({ ok: true } as const);
  res.cookies.set(sessionCookieOptions.name, cookieValue, sessionCookieOptions);
  return res;
}
