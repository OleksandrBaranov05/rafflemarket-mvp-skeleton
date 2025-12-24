import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

type Body = {
  name?: string;
  avatarUrl?: string;
  canSell?: boolean;
};

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ message: "Profile API route is working" });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await sleep(300);

    const body = (await req.json()) as Body;

    // Перевіряємо, чи користувач існує в базі
    const existingUser = mockDb.users.findById(session.user.id);
    if (!existingUser) {
      console.error(`User not found in DB: ${session.user.id}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Оновлюємо користувача (тільки передаємо поля, які дійсно є в body)
    const updateData: { name?: string; avatarUrl?: string; canSell?: boolean } = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
    if (body.canSell !== undefined) updateData.canSell = body.canSell;

    const updatedUser = mockDb.users.update(session.user.id, updateData);

    if (!updatedUser) {
      console.error(`Failed to update user: ${session.user.id}`);
      return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }

    // Створюємо нову сесію з оновленими даними
    const cookieValue = createSessionCookie({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        canSell: updatedUser.canSell,
        balance: updatedUser.balance,
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
        canSell: updatedUser.canSell,
        balance: updatedUser.balance,
      },
    });
    res.cookies.set(sessionCookieOptions.name, cookieValue, sessionCookieOptions);
    return res;
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

