"use client";

import { useQuery } from "@tanstack/react-query";
import { getRaffleById } from "@/lib/api/raffles/getById";
import { queryKeys } from "@/lib/utils/queryKeys";
import styles from "./LiveTicketCounter.module.css";

type Props = {
  raffleId: string;
  initialSold: number;
  totalTickets: number;
};

export function LiveTicketCounter({ raffleId, initialSold, totalTickets }: Props) {
  const { data } = useQuery({
    queryKey: queryKeys.raffles.detail(raffleId),
    queryFn: () => getRaffleById(raffleId),
    refetchInterval: 5000, // Оновлювати кожні 5 секунд
    initialData: { raffle: { ticketsSold: initialSold } } as any,
  });

  const ticketsSold = data?.raffle?.ticketsSold || initialSold;
  const progressPercent = (ticketsSold / totalTickets) * 100;

  return (
    <div className={styles.counter}>
      <div className={styles.counterHeader}>
        <span className={styles.counterLabel}>Продано квитків:</span>
        <span className={styles.counterValue}>{ticketsSold}</span>
        <span className={styles.counterTotal}>/ {totalTickets}</span>
        <span className={styles.liveIndicator} title="Оновлюється автоматично">●</span>
      </div>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={ticketsSold}
          aria-valuemin={0}
          aria-valuemax={totalTickets}
        />
      </div>
      <div className={styles.remaining}>
        Залишилось: <strong>{totalTickets - ticketsSold}</strong> квитків
      </div>
    </div>
  );
}

