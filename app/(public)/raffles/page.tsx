import Link from "next/link";
import Image from "next/image";
import { RafflesFilters } from "./RafflesFilters";
import styles from "./raffles.module.css";
import { mockDb } from "@/lib/store/mockDb";

type SearchParams = Promise<{ q?: string; category?: string; status?: string; sort?: string }>;

async function getRaffles(searchParams: Awaited<SearchParams>) {
  let raffles = mockDb.raffles.findAll();

  // Фільтрація по пошуку
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();
    raffles = raffles.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
    );
  }

  // Фільтрація по категорії
  if (searchParams.category && searchParams.category !== "all") {
    raffles = raffles.filter((r) => r.category === searchParams.category);
  }

  // Фільтрація по статусу
  if (searchParams.status && searchParams.status !== "all") {
    raffles = raffles.filter((r) => r.status === searchParams.status);
  }

  // Сортування
  if (searchParams.sort) {
    switch (searchParams.sort) {
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
  } else {
    // За замовчуванням - новіші спочатку
    raffles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return raffles;
}

export default async function RafflesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raffles = await getRaffles(params);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Каталог розіграшів</h1>
      <p className={styles.subtitle}>Обирайте лоти та купуйте квитки</p>

      <div className={styles.filtersWrapper}>
        <RafflesFilters />
      </div>

      {raffles.length === 0 ? (
        <div className={styles.empty}>Наразі немає доступних розіграшів</div>
      ) : (
        <div className={styles.grid}>
          {raffles.map((raffle) => (
            <Link key={raffle.id} href={`/raffles/${raffle.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={raffle.imageUrl}
                  alt={raffle.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {raffle.status === "completed" && <div className={styles.badge}>Завершено</div>}
                {raffle.status === "active" && (
                  <div className={styles.badgeActive}>
                    {raffle.ticketsSold}/{raffle.totalTickets}
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{raffle.title}</h2>
                {raffle.category && <p className={styles.category}>{raffle.category}</p>}
                <div className={styles.cardFooter}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{raffle.ticketPrice} ₴</span>
                    <span className={styles.perTicket}>за квиток</span>
                  </div>
                  <div className={styles.totalPriceRow}>
                    <span className={styles.totalPriceLabel}>Загальна вартість:</span>
                    <span className={styles.totalPrice}>{(raffle.totalTickets * raffle.ticketPrice).toLocaleString('uk-UA')} ₴</span>
                  </div>
                </div>
                <div className={styles.progress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

