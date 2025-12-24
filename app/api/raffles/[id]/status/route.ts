import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import type { RaffleStatus } from "@/lib/types/raffle";
import { sleep } from "@/lib/utils/sleep";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await sleep(300);

  const { id } = await params;
  const body = (await req.json()) as { status: RaffleStatus };

  const raffle = mockDb.raffles.findById(id);
  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  const updatedRaffle = mockDb.raffles.update(id, { status: body.status });

  if (!updatedRaffle) {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ raffle: updatedRaffle });
}

