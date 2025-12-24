import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import type { BuyTicketsInput } from "@/lib/types/raffle";
import { sleep } from "@/lib/utils/sleep";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(400);

  const body = (await req.json()) as BuyTicketsInput;
  const raffle = mockDb.raffles.findById(body.raffleId);

  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  if (raffle.status !== "active") {
    return NextResponse.json({ message: "Raffle is not active" }, { status: 400 });
  }

  if (raffle.ticketsSold + body.quantity > raffle.totalTickets) {
    return NextResponse.json({ message: "Not enough tickets available" }, { status: 400 });
  }

  // Перевірка обмеження квитків на користувача
  const userTickets = mockDb.tickets.findByUser(session.user.id).filter((t) => t.raffleId === body.raffleId);
  const userTicketsCount = userTickets.length;
  const maxTicketsPerUser = raffle.maxTicketsPerUser;

  if (maxTicketsPerUser && userTicketsCount + body.quantity > maxTicketsPerUser) {
    const available = maxTicketsPerUser - userTicketsCount;
    return NextResponse.json(
      {
        message: `Ви можете купити максимум ${maxTicketsPerUser} квитків на цей розіграш. Доступно: ${available}`,
      },
      { status: 400 }
    );
  }

  const tickets = mockDb.tickets.createMany(
    Array.from({ length: body.quantity }, () => ({
      raffleId: body.raffleId,
      userId: session.user.id,
      userEmail: session.user.email,
    }))
  );

  const totalAmount = body.quantity * raffle.ticketPrice;
  const order = mockDb.orders.create({
    userId: session.user.id,
    raffleId: body.raffleId,
    ticketIds: tickets.map((t) => t.id),
    quantity: body.quantity,
    totalAmount,
    status: "paid",
  });

  // Escrow обробка буде в окремому API

  // Перевіряємо чи всі квитки продані для автоматичного завершення
  const updatedRaffle = mockDb.raffles.findById(body.raffleId);
  if (updatedRaffle && updatedRaffle.ticketsSold >= updatedRaffle.totalTickets) {
    // Випадковий вибір переможця
    const allTickets = mockDb.tickets.findByRaffle(body.raffleId);
    const winnerTicket = allTickets[Math.floor(Math.random() * allTickets.length)];
    mockDb.tickets.setWinner(winnerTicket.id);
    mockDb.raffles.update(body.raffleId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      winnerTicketId: winnerTicket.id,
      winnerUserId: winnerTicket.userId,
    });
  }

  return NextResponse.json({ order, tickets });
}

