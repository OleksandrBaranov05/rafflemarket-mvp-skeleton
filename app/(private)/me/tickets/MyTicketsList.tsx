"use client";

import Link from "next/link";
import Image from "next/image";
import type { TicketParticipationStatus } from "@/lib/types/raffle";
import styles from "./MyTicketsList.module.css";

type Participation = {
  raffle: {
    id: string;
    title: string;
    imageUrl: string;
    status: string;
    winnerTicketId?: string;
  };
  tickets: Array<{
    id: string;
    ticketNumber: number;
    isWinner: boolean;
  }>;
  participationStatus: TicketParticipationStatus;
};

type Props = {
  participations: Participation[];
};

export function MyTicketsList({ participations }: Props) {
  if (participations.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎫</div>
        <h2 className={styles.emptyTitle}>У вас поки немає придбаних квитків</h2>
        <p className={styles.emptyText}>Почніть з перегляду доступних розіграшів та купівлі квитків</p>
        <Link href="/raffles" className={styles.emptyLink}>
          Переглянути каталог
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {participations.map((participation) => (
        <ParticipationCard key={participation.raffle.id} participation={participation} />
      ))}
    </div>
  );
}

type CardProps = {
  participation: Participation;
};

function ParticipationCard({ participation }: CardProps) {
  const { raffle, tickets, participationStatus } = participation;
  const isWon = participationStatus === "won";
  const statusConfig = getStatusConfig(participationStatus);

  return (
    <div className={`${styles.card} ${isWon ? styles.cardWon : ""}`}>
      <Link href={`/raffles/${raffle.id}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={raffle.imageUrl}
            alt={raffle.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {isWon && <div className={styles.winnerBadge}>🏆 Перемога</div>}
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/raffles/${raffle.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{raffle.title}</h3>
        </Link>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Кількість квитків:</span>
            <span className={styles.statValue}>{tickets.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Статус участі:</span>
            <span className={`${styles.statusBadge} ${styles[statusConfig.class]}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className={styles.ticketNumbers}>
          <span className={styles.ticketNumbersLabel}>Номери квитків:</span>
          <div className={styles.numbers}>
            {tickets.map((ticket) => (
              <span
                key={ticket.id}
                className={`${styles.ticketNumber} ${ticket.isWinner ? styles.winnerNumber : ""}`}
              >
                #{ticket.ticketNumber}
                {ticket.isWinner && " 🎉"}
              </span>
            ))}
          </div>
        </div>

        {raffle.status === "completed" && (
          <Link href={`/lots/${raffle.id}/result`} className={styles.resultLink}>
            Переглянути результат розіграшу →
          </Link>
        )}
      </div>
    </div>
  );
}

function getStatusConfig(status: TicketParticipationStatus) {
  const configs: Record<
    TicketParticipationStatus,
    { label: string; class: string }
  > = {
    pending: { label: "Очікується", class: "statusPending" },
    active: { label: "Активна участь", class: "statusActive" },
    finished: { label: "Завершено", class: "statusFinished" },
    won: { label: "Перемога", class: "statusWon" },
    lost: { label: "Не виграв", class: "statusLost" },
  };
  return configs[status] || configs.finished;
}

