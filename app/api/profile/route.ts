import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

type Body = {
  name?: string;
  avatarUrl?: string;
};

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(300);

  const body = (await req.json()) as Body;

  // Оновлюємо користувача
  const updatedUser = mockDb.users.update(session.user.id, {
    name: body.name,
    avatarUrl: body.avatarUrl,
  });

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Створюємо нову сесію з оновленими даними
  const cookieValue = createSessionCookie({
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
    },
  });

  const res = NextResponse.json({
    ok: true as const,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
    },
  });
  res.cookies.set(sessionCookieOptions.name, cookieValue, sessionCookieOptions);
  return res;
}

