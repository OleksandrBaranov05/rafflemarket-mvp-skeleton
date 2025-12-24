"use client";

import Link from "next/link";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listRaffles } from "@/lib/api/raffles/list";
import { queryKeys } from "@/lib/utils/queryKeys";
import { Loader } from "../Loader/Loader";
import { useSearchParams } from "next/navigation";
import styles from "./LotsGrid.module.css";

type Props = {
  initialRaffles: any[];
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
    sort?: string;
    priceMin?: string;
    priceMax?: string;
  };
};

export function LotsGrid({ initialRaffles, searchParams }: Props) {
  const urlSearchParams = useSearchParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKeys.raffles.list(urlSearchParams.toString()),
    queryFn: ({ pageParam = 1 }) => listRaffles({ ...searchParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Якщо в останній сторінці менше 12 лотів, то немає наступної сторінки
      if (lastPage.raffles.length < 12) return undefined;
      return lastPage.currentPage + 1;
    },
    initialData: {
      pages: [{ raffles: initialRaffles, currentPage: 1, totalPages: 1, totalItems: initialRaffles.length }],
      pageParams: [1],
    },
  });

  const raffles = data?.pages.flatMap((page) => page.raffles) || [];

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (raffles.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Наразі немає доступних розіграшів</p>
        <p className={styles.emptySubtext}>Спробуйте змінити фільтри</p>
      </div>
    );
  }

  return (
    <>
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
                  <span className={styles.totalPrice}>
                    {(raffle.totalTickets * raffle.ticketPrice).toLocaleString("uk-UA")} ₴
                  </span>
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

      {hasNextPage && (
        <div className={styles.loadMore}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreBtn}
          >
            {isFetchingNextPage ? (
              <>
                <Loader size="sm" /> Завантаження...
              </>
            ) : (
              "Показати ще"
            )}
          </button>
        </div>
      )}
    </>
  );
}

