import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
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

export async function PUT(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(300);

  const { id } = await params;
  const body = (await req.json()) as Partial<{
    title: string;
    description: string;
    imageUrl: string;
    totalTickets: number;
    ticketPrice: number;
    category: string;
    maxTicketsPerUser?: number;
  }>;

  const raffle = mockDb.raffles.findById(id);
  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  // Перевіряємо, чи користувач є власником або адміном
  if (raffle.sellerId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Не дозволяємо редагувати якщо вже є продані квитки (захист від зміни правил гри)
  if (raffle.ticketsSold > 0) {
    return NextResponse.json(
      { message: "Cannot edit raffle with sold tickets" },
      { status: 400 }
    );
  }

  const updatedRaffle = mockDb.raffles.update(id, body);

  if (!updatedRaffle) {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ raffle: updatedRaffle });
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(300);

  const { id } = await params;
  const raffle = mockDb.raffles.findById(id);
  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  // Перевіряємо, чи користувач є власником або адміном
  if (raffle.sellerId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Не дозволяємо видаляти якщо вже є продані квитки
  if (raffle.ticketsSold > 0) {
    return NextResponse.json(
      { message: "Cannot delete raffle with sold tickets" },
      { status: 400 }
    );
  }

  const deleted = mockDb.raffles.delete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}

