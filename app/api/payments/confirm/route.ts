import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

/**
 * MVP DEMO: Підтверджує оплату (симуляція)
 * В реальному додатку це буде webhook від Stripe/PayPal
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(300);

  const body = (await req.json()) as {
    paymentIntentId: string;
    raffleId: string;
    quantity: number;
  };

  // DEMO: Симуляція успішної оплати
  // В реальному додатку тут буде:
  // const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId);
  // if (paymentIntent.status !== "succeeded") {
  //   return NextResponse.json({ message: "Payment not succeeded" }, { status: 400 });
  // }

  const raffle = mockDb.raffles.findById(body.raffleId);
  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  // Перевірка доступності квитків
  const availableTickets = raffle.totalTickets - raffle.ticketsSold;
  if (availableTickets < body.quantity) {
    return NextResponse.json(
      { message: `Available tickets: ${availableTickets}, requested: ${body.quantity}` },
      { status: 400 }
    );
  }

  // Створюємо квитки (це вже робиться в /api/tickets/buy, але для MVP можемо тут)
  // В реальному додатку це буде викликатися з webhook, а не з фронтенду

  return NextResponse.json({
    success: true,
    message: "Payment confirmed",
  });
}

