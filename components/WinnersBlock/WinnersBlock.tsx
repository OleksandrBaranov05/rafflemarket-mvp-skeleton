import Link from "next/link";
import Image from "next/image";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./WinnersBlock.module.css";

async function getRecentWinners() {
  const allRaffles = mockDb.raffles.findAll();
  const completedRaffles = allRaffles
    .filter((r) => r.status === "completed" && r.winnerUserId && r.completedAt)
    .sort((a, b) => {
      // Сортуємо за датою завершення (новіші спочатку)
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6); // Останні 6 переможців

  return completedRaffles;
}

function maskUserId(userId: string): string {
  if (userId.length <= 8) return userId;
  return `${userId.substring(0, 4)}***${userId.substring(userId.length - 2)}`;
}

export async function WinnersBlock() {
  const winners = await getRecentWinners();

  if (winners.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Останні переможці</h2>

        <div className={styles.grid}>
          {winners.map((lot) => (
            <div key={lot.id} className={styles.card}>
              <Link href={`/lots/${lot.id}/result`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={lot.imageUrl}
                    alt={lot.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.winnerBadge}>🏆 Переможець</div>
                </div>
              </Link>
              <div className={styles.cardContent}>
                <Link href={`/raffles/${lot.id}`} className={styles.lotLink}>
                  <h3 className={styles.cardTitle}>{lot.title}</h3>
                </Link>
                <div className={styles.winnerInfo}>
                  <span className={styles.winnerLabel}>Переможець:</span>
                  <span className={styles.winnerId}>{lot.winnerUserId ? maskUserId(lot.winnerUserId) : "N/A"}</span>
                </div>
                {lot.completedAt && (
                  <div className={styles.date}>
                    {new Date(lot.completedAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

