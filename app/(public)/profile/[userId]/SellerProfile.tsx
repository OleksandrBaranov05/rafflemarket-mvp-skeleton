import Link from "next/link";
import Image from "next/image";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./SellerProfile.module.css";

type Props = {
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      avatarUrl?: string;
      role: string;
    };
    stats: {
      totalRaffles: number;
      completedRaffles: number;
      activeRaffles: number;
      successRate: number;
    };
    raffles: Array<{
      id: string;
      title: string;
      imageUrl: string;
      status: string;
      ticketsSold: number;
      totalTickets: number;
      ticketPrice: number;
    }>;
  };
};

export async function SellerProfile({ data }: Props) {
  const { user, stats, raffles } = data;

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";
  const avatarSrc = user.avatarUrl || defaultAvatar;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {avatarSrc.startsWith("data:") ? (
              <img src={avatarSrc} alt={user.name || user.email} className={styles.avatar} />
            ) : (
              <Image
                src={avatarSrc}
                alt={user.name || user.email}
                width={120}
                height={120}
                className={styles.avatar}
              />
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.name}>{user.name || user.email}</h1>
          <p className={styles.email}>{user.email}</p>
          {user.role === "seller" && <span className={styles.badge}>Продавець</span>}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalRaffles}</div>
          <div className={styles.statLabel}>Створено лотів</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.completedRaffles}</div>
          <div className={styles.statLabel}>Завершено розіграшів</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.successRate}%</div>
          <div className={styles.statLabel}>Успішність</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.activeRaffles}</div>
          <div className={styles.statLabel}>Активних розіграшів</div>
        </div>
      </div>

      {/* Raffles */}
      {raffles.length > 0 && (
        <div className={styles.rafflesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Лоти продавця</h2>
            <Link href={`/raffles?seller=${user.id}`} className={styles.viewAllLink}>
              Переглянути всі →
            </Link>
          </div>

          <div className={styles.rafflesGrid}>
            {raffles.map((raffle) => (
              <Link key={raffle.id} href={`/raffles/${raffle.id}`} className={styles.raffleCard}>
                <div className={styles.raffleImageWrapper}>
                  <Image
                    src={raffle.imageUrl}
                    alt={raffle.title}
                    fill
                    className={styles.raffleImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.raffleBadge}>
                    {raffle.status === "completed" ? "Завершено" : "Активний"}
                  </div>
                </div>
                <div className={styles.raffleContent}>
                  <h3 className={styles.raffleTitle}>{raffle.title}</h3>
                  <div className={styles.raffleStats}>
                    <span>
                      {raffle.ticketsSold}/{raffle.totalTickets} квитків
                    </span>
                    <span className={styles.rafflePrice}>{raffle.ticketPrice} ₴</span>
                  </div>
                  <div className={styles.raffleProgress}>
                    <div
                      className={styles.raffleProgressBar}
                      style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

