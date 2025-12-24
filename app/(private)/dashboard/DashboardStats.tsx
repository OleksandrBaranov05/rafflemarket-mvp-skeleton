"use client";

import { useQuery } from "@tanstack/react-query";
import { getRafflesBySeller } from "@/lib/api/raffles/getBySeller";
import { queryKeys } from "@/lib/utils/queryKeys";
import { Loader } from "@/components/Loader/Loader";
import styles from "./DashboardStats.module.css";

type Props = {
  userId: string;
};

export function DashboardStats({ userId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.raffles.bySeller(userId),
    queryFn: () => getRafflesBySeller(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <Loader size="sm" />
      </div>
    );
  }

  const raffles = data?.raffles || [];

  const stats = {
    total: raffles.length,
    active: raffles.filter((r) => r.status === "active").length,
    completed: raffles.filter((r) => r.status === "completed").length,
    pending: raffles.filter((r) => r.status === "pending").length,
    totalRevenue: raffles.reduce((sum, r) => sum + r.ticketsSold * r.ticketPrice, 0),
    totalTicketsSold: raffles.reduce((sum, r) => sum + r.ticketsSold, 0),
    platformFee: raffles.reduce(
      (sum, r) => sum + (r.ticketsSold * r.ticketPrice * r.platformFeePercent) / 100,
      0
    ),
    netRevenue: 0,
  };

  stats.netRevenue = stats.totalRevenue - stats.platformFee;

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Статистика</h2>
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Всього розіграшів</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Активних</div>
          <div className={styles.statValue}>{stats.active}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Завершених</div>
          <div className={styles.statValue}>{stats.completed}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>На модерації</div>
          <div className={styles.statValue}>{stats.pending}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Продано квитків</div>
          <div className={styles.statValue}>{stats.totalTicketsSold}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Загальний дохід</div>
          <div className={styles.statValue}>{stats.totalRevenue.toLocaleString()} ₴</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Комісія платформи</div>
          <div className={`${styles.statValue} ${styles.fee}`}>
            {stats.platformFee.toLocaleString()} ₴
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Чистий дохід</div>
          <div className={`${styles.statValue} ${styles.net}`}>
            {stats.netRevenue.toLocaleString()} ₴
          </div>
        </div>
      </div>
    </div>
  );
}

