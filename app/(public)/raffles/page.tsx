import { Metadata } from "next";
import { RafflesFilters } from "./RafflesFilters";
import { LotsGrid } from "@/components/LotsGrid/LotsGrid";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./raffles.module.css";

type SearchParams = Promise<{ q?: string; category?: string; status?: string; sort?: string; priceMin?: string; priceMax?: string }>;

export const metadata: Metadata = generatePageMetadata({
  title: "Каталог розіграшів",
  description: "Перегляньте всі доступні розіграші та купіть квитки на реальні товари",
});

function filterAndSortRaffles(
  raffles: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    sellerId: string;
    sellerEmail: string;
    totalTickets: number;
    ticketsSold: number;
    ticketPrice: number;
    status: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
  }>,
  params: { q?: string; category?: string; status?: string; sort?: string; priceMin?: string; priceMax?: string }
) {
  let filtered = [...raffles];

  // Пошук
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
    );
  }

  // Категорія
  if (params.category && params.category !== "all") {
    filtered = filtered.filter((r) => r.category === params.category);
  }

  // Статус
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  // Ціна мінімум
  if (params.priceMin) {
    const min = parseFloat(params.priceMin);
    if (!isNaN(min)) {
      filtered = filtered.filter((r) => r.ticketPrice >= min);
    }
  }

  // Ціна максимум
  if (params.priceMax) {
    const max = parseFloat(params.priceMax);
    if (!isNaN(max)) {
      filtered = filtered.filter((r) => r.ticketPrice <= max);
    }
  }

  // Сортування
  if (params.sort === "price-asc") {
    filtered.sort((a, b) => a.ticketPrice - b.ticketPrice);
  } else if (params.sort === "price-desc") {
    filtered.sort((a, b) => b.ticketPrice - a.ticketPrice);
  } else if (params.sort === "popular") {
    filtered.sort((a, b) => b.ticketsSold - a.ticketsSold);
  } else {
    // newest (за замовчуванням)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
}

export default async function RafflesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  
  // Отримуємо дані напряму з mockDb на сервері
  const allRaffles = mockDb.raffles.findAll();
  const filteredRaffles = filterAndSortRaffles(allRaffles, params);
  
  // Пагінація (перша сторінка, 12 елементів)
  const page = 1;
  const perPage = 12;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedRaffles = filteredRaffles.slice(start, end);
  
  const totalItems = filteredRaffles.length;
  const totalPages = Math.ceil(totalItems / perPage);
  
  const initialData = {
    raffles: paginatedRaffles,
    currentPage: page,
    totalPages,
    totalItems,
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Каталог розіграшів</h1>
      <p className={styles.subtitle}>Обирайте лоти та купуйте квитки</p>

      <div className={styles.filtersWrapper}>
        <RafflesFilters />
      </div>

      <LotsGrid initialRaffles={initialData.raffles} searchParams={params} />
    </div>
  );
}

