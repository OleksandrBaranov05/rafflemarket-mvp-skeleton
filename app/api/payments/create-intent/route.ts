import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { sleep } from "@/lib/utils/sleep";

/**
 * MVP DEMO: Створює payment intent для демо платежів
 * В реальному додатку тут буде інтеграція з Stripe, PayPal або іншим провайдером
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await sleep(300);

  const body = (await req.json()) as {
    raffleId: string;
    quantity: number;
  };

  const raffle = mockDb.raffles.findById(body.raffleId);
  if (!raffle) {
    return NextResponse.json({ message: "Raffle not found" }, { status: 404 });
  }

  if (raffle.status !== "active") {
    return NextResponse.json({ message: "Raffle is not active" }, { status: 400 });
  }

  const totalAmount = body.quantity * raffle.ticketPrice;

  // DEMO: Створюємо payment intent ID (в реальному додатку це буде ID від платежного провайдера)
  const paymentIntentId = `pi_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // В реальному додатку тут буде:
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: totalAmount * 100, // Конвертуємо в копійки/центи
  //   currency: "uah",
  //   metadata: { raffleId: body.raffleId, quantity: body.quantity, userId: session.user.id },
  // });

  return NextResponse.json({
    paymentIntentId,
    amount: totalAmount,
    currency: "UAH",
    status: "pending",
  });
}

