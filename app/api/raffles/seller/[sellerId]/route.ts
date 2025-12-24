import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import { sleep } from "@/lib/utils/sleep";

type Params = { params: Promise<{ sellerId: string }> };

export async function GET(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(200);
  const { sellerId } = await params;

  // Тільки власник або адмін можуть переглядати
  if (session.user.id !== sellerId && session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const raffles = mockDb.raffles.findBySeller(sellerId);
  return NextResponse.json({ raffles });
}

