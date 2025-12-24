import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import type { CreateRaffleInput } from "@/lib/types/raffle";
import { sleep } from "@/lib/utils/sleep";

export async function GET() {
  await sleep(200);
  const raffles = mockDb.raffles.findAll();
  return NextResponse.json({ raffles });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await sleep(300);

  const body = (await req.json()) as CreateRaffleInput;

  const raffle = mockDb.raffles.create({
    ...body,
    sellerId: session.user.id,
    sellerEmail: session.user.email,
    platformFeePercent: 10,
  });

  return NextResponse.json({ raffle });
}

