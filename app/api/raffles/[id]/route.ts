import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  await sleep(200);
  const { id } = await params;
  const raffle = mockDb.raffles.findById(id);

  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  const tickets = mockDb.tickets.findByRaffle(id);

  return NextResponse.json({ raffle, tickets });
}

