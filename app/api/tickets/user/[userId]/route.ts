import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import { sleep } from "@/lib/utils/sleep";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(200);
  const { userId } = await params;

  // Тільки власник може переглядати свої квитки
  if (session.user.id !== userId && session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const tickets = mockDb.tickets.findByUser(userId);
  
  // Додаємо інформацію про лоти для кожного квитка
  const ticketsWithRaffles = tickets.map((ticket) => {
    const raffle = mockDb.raffles.findById(ticket.raffleId);
    return {
      ...ticket,
      raffle: raffle ? {
        id: raffle.id,
        title: raffle.title,
        imageUrl: raffle.imageUrl,
        status: raffle.status,
        winnerTicketId: raffle.winnerTicketId,
      } : null,
    };
  });

  return NextResponse.json({ tickets: ticketsWithRaffles });
}

