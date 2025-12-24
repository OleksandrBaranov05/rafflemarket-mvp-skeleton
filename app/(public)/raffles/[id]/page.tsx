import Image from "next/image";
import { notFound } from "next/navigation";
import { BuyTicketsFormWrapper } from "./BuyTicketsFormWrapper";
import { MyTicketsWrapper } from "./MyTicketsWrapper";
import { LiveTicketCounter } from "./LiveTicketCounter";
import styles from "./detail.module.css";

async function getRaffle(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/raffles/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch");
    }
    return await res.json();
  } catch {
    return null;
  }
}

export default async function RaffleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRaffle(id);

  if (!data || !data.raffle) {
    notFound();
  }

  const { raffle, tickets } = data;
  const progressPercent = (raffle.ticketsSold / raffle.totalTickets) * 100;
  const ticketsAvailable = raffle.totalTickets - raffle.ticketsSold;

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={raffle.imageUrl}
              alt={raffle.title}
              fill
              className={styles.image}
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {raffle.status === "completed" && <div className={styles.badge}>Завершено</div>}
            {raffle.status === "active" && (
              <div className={styles.badgeActive}>
                {raffle.ticketsSold}/{raffle.totalTickets}
              </div>
            )}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>{raffle.title}</h1>
            {raffle.category && <span className={styles.category}>{raffle.category}</span>}
          </div>

          <div className={styles.status}>
            Статус: <span className={styles.statusValue}>{getStatusText(raffle.status)}</span>
          </div>

          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>Опис</h2>
            <p>{raffle.description}</p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Ціна квитка</span>
              <span className={styles.statValue}>{raffle.ticketPrice} ₴</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Всього квитків</span>
              <span className={styles.statValue}>{raffle.totalTickets}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Продано</span>
              <span className={styles.statValue}>{raffle.ticketsSold}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Доступно</span>
              <span className={styles.statValue}>{ticketsAvailable}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Загальна вартість лоту</span>
              <span className={`${styles.statValue} ${styles.totalValue}`}>
                {(raffle.totalTickets * raffle.ticketPrice).toLocaleString('uk-UA')} ₴
              </span>
            </div>
          </div>

          {raffle.status === "active" && (
            <LiveTicketCounter
              raffleId={raffle.id}
              initialSold={raffle.ticketsSold}
              totalTickets={raffle.totalTickets}
            />
          )}

          {raffle.status !== "active" && (
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Прогрес продажу</span>
                <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          <MyTicketsWrapper raffleId={raffle.id} />

          {raffle.status === "completed" && raffle.winnerTicketId && (
            <div className={styles.winnerSection}>
              <h3 className={styles.winnerTitle}>🎉 Переможець визначений!</h3>
              <p>
                Переможний квиток: <strong>#{raffle.winnerTicketId}</strong>
              </p>
              <a href={`/lots/${raffle.id}/result`} className={styles.resultLink}>
                Переглянути детальний результат →
              </a>
            </div>
          )}

          {raffle.status === "active" && (
            <div className={styles.buySection}>
              <BuyTicketsFormWrapper raffle={raffle} ticketsAvailable={ticketsAvailable} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    draft: "Чернетка",
    pending: "На модерації",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
    rejected: "Відхилено",
  };
  return map[status] || status;
}

