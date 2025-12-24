import { NextResponse } from "next/server";
import { mockDb } from "@/lib/store/mockDb";
import { getSession } from "@/lib/auth/session";
import type { CreateRaffleInput } from "@/lib/types/raffle";
import { sleep } from "@/lib/utils/sleep";

export async function GET(req: Request) {
  await sleep(200);
  const { searchParams } = new URL(req.url);

  let raffles = mockDb.raffles.findAll();

  // Фільтрація по пошуку
  const q = searchParams.get("q");
  if (q) {
    const query = q.toLowerCase();
    raffles = raffles.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
    );
  }

  // Фільтрація по категорії
  const category = searchParams.get("category");
  if (category && category !== "all") {
    raffles = raffles.filter((r) => r.category === category);
  }

  // Фільтрація по статусу
  const status = searchParams.get("status");
  if (status && status !== "all") {
    raffles = raffles.filter((r) => r.status === status);
  }

  // Фільтрація по ціні квитка
  const priceMin = searchParams.get("priceMin");
  if (priceMin) {
    const minPrice = Number(priceMin);
    if (!isNaN(minPrice)) {
      raffles = raffles.filter((r) => r.ticketPrice >= minPrice);
    }
  }
  const priceMax = searchParams.get("priceMax");
  if (priceMax) {
    const maxPrice = Number(priceMax);
    if (!isNaN(maxPrice)) {
      raffles = raffles.filter((r) => r.ticketPrice <= maxPrice);
    }
  }

  // Сортування
  const sort = searchParams.get("sort") || "newest";
  switch (sort) {
    case "oldest":
      raffles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "price-low":
      raffles.sort((a, b) => a.ticketPrice - b.ticketPrice);
      break;
    case "price-high":
      raffles.sort((a, b) => b.ticketPrice - a.ticketPrice);
      break;
    case "popular":
      raffles.sort((a, b) => b.ticketsSold - a.ticketsSold);
      break;
    default: // newest
      raffles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Пагінація
  const ITEMS_PER_PAGE = 12;
  const page = Number(searchParams.get("page")) || 1;
  const totalItems = raffles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRaffles = raffles.slice(startIndex, endIndex);

  return NextResponse.json({
    raffles: paginatedRaffles,
    currentPage: page,
    totalPages,
    totalItems,
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Перевіряємо, чи користувач може продавати (через canSell або роль admin)
  const canSell = session.user.canSell === true || session.user.role === "admin";
  if (!canSell) {
    return NextResponse.json({ message: "Forbidden. Enable seller mode in profile." }, { status: 403 });
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

