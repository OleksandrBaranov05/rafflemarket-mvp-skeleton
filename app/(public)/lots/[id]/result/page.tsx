import Image from "next/image";
import { notFound } from "next/navigation";
import { mockDb } from "@/lib/store/mockDb";
import type { Metadata } from "next";
import styles from "./result.module.css";

async function getRaffleResult(id: string) {
  const raffle = mockDb.raffles.findById(id);
  if (!raffle || raffle.status !== "completed") {
    return null;
  }

  const tickets = mockDb.tickets.findByRaffle(id);
  const winnerTicket = tickets.find((t) => t.id === raffle.winnerTicketId);

  return {
    raffle,
    winnerTicket,
    totalTickets: tickets.length,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getRaffleResult(id);

  if (!data) {
    return {
      title: "Результат розіграшу не знайдено",
    };
  }

  const { raffle } = data;
  const maskedWinner = raffle.winnerUserId ? maskEmail(raffle.winnerUserId) : "Переможець";

  return {
    title: `Результат розіграшу: ${raffle.title}`,
    description: `Переможець розіграшу "${raffle.title}" визначено. Переможний квиток #${raffle.winnerTicketId}`,
    openGraph: {
      title: `Результат розіграшу: ${raffle.title}`,
      description: `Переможець: ${maskedWinner}`,
      images: [raffle.imageUrl],
    },
  };
}

export default async function RaffleResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRaffleResult(id);

  if (!data) {
    notFound();
  }

  const { raffle, winnerTicket, totalTickets } = data;
  const maskedWinner = maskEmail(raffle.winnerUserId || "");
  const completedTimeAgo = raffle.completedAt ? formatTimeAgo(new Date(raffle.completedAt)) : "";

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Результат розіграшу</h1>
          <p className={styles.subtitle}>Розіграш завершено {completedTimeAgo}</p>
        </div>

        <div className={styles.raffleCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={raffle.imageUrl}
              alt={raffle.title}
              fill
              className={styles.image}
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          <div className={styles.content}>
            <h2 className={styles.raffleTitle}>{raffle.title}</h2>
            {raffle.category && <span className={styles.category}>{raffle.category}</span>}

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Всього квитків</span>
                <span className={styles.statValue}>{totalTickets}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Ціна квитка</span>
                <span className={styles.statValue}>{raffle.ticketPrice} ₴</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.winnerSection}>
          <div className={styles.winnerIcon}>🎉</div>
          <h3 className={styles.winnerTitle}>Переможець визначено!</h3>
          <div className={styles.winnerInfo}>
            <div className={styles.winnerTicket}>
              <span className={styles.winnerLabel}>Переможний квиток:</span>
              <span className={styles.winnerNumber}>#{winnerTicket?.ticketNumber || raffle.winnerTicketId}</span>
            </div>
            <div className={styles.winnerUser}>
              <span className={styles.winnerLabel}>Переможець:</span>
              <span className={styles.winnerEmail}>{maskedWinner}</span>
            </div>
          </div>
        </div>

        <div className={styles.algorithmSection}>
          <h3 className={styles.algorithmTitle}>Як визначається переможець?</h3>
          <div className={styles.algorithmSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Всі квитки продані</h4>
                <p className={styles.stepText}>Розіграш автоматично завершується коли всі квитки придбані</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Випадковий вибір</h4>
                <p className={styles.stepText}>
                  Система використовує криптографічно стійкий генератор випадкових чисел для вибору переможного квитка
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Прозорість</h4>
                <p className={styles.stepText}>
                  Результат зберігається в системі з точним timestamp для повної прозорості процесу
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <a href="/raffles" className={styles.backLink}>
            ← Повернутися до каталогу
          </a>
        </div>
      </div>
    </div>
  );
}

function maskEmail(emailOrId: string): string {
  if (!emailOrId) return "Невідомий користувач";
  if (emailOrId.includes("@")) {
    const [name, domain] = emailOrId.split("@");
    const maskedName = name.length > 2 ? `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}` : name;
    return `${maskedName}@${domain}`;
  }
  // Якщо це ID
  return `${emailOrId.slice(0, 4)}***${emailOrId.slice(-2)}`;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} ${diffDays === 1 ? "день" : "днів"} тому`;
  if (diffHours > 0) return `${diffHours} ${diffHours === 1 ? "годину" : "годин"} тому`;
  if (diffMins > 0) return `${diffMins} ${diffMins === 1 ? "хвилину" : "хвилин"} тому`;
  return "щойно";
}

