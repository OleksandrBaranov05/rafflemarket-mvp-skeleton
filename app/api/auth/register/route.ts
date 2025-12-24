import { NextResponse } from "next/server";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

type Body = { email: string; password: string };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  await sleep(300);

  // Валідація
  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email та пароль обов'язкові" }, { status: 400 });
  }

  if (body.password.length < 5) {
    return NextResponse.json({ message: "Пароль має містити мінімум 5 символів" }, { status: 400 });
  }

  try {
    // Створення користувача
    const newUser = mockDb.users.create({
      email: body.email,
      password: body.password,
      role: "user", // За замовчуванням звичайний користувач
    });

    // Створюємо сесію
    const cookieValue = createSessionCookie({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
      },
    });

    const res = NextResponse.json({
      ok: true as const,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
      },
    });
    res.cookies.set(sessionCookieOptions.name, cookieValue, sessionCookieOptions);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Помилка при реєстрації";
    return NextResponse.json({ message }, { status: 400 });
  }
}

