import Link from "next/link";
import Image from "next/image";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./FeaturedLotsBlock.module.css";

async function getFeaturedLots() {
  // Отримуємо активні лоти, сортуємо за популярністю (продано квитків) та датою
  const allRaffles = mockDb.raffles.findAll();
  const activeRaffles = allRaffles
    .filter((r) => r.status === "active")
    .sort((a, b) => {
      // Спочатку за кількістю проданих квитків, потім за датою
      if (b.ticketsSold !== a.ticketsSold) {
        return b.ticketsSold - a.ticketsSold;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 6); // Топ 6 лотів

  return activeRaffles;
}

export async function FeaturedLotsBlock() {
  const featuredLots = await getFeaturedLots();

  if (featuredLots.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Популярні розіграші</h2>
          <Link href="/raffles" className={styles.link}>
            До всіх лотів →
          </Link>
        </div>

        <div className={styles.grid}>
          {featuredLots.map((lot) => (
            <Link key={lot.id} href={`/raffles/${lot.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={lot.imageUrl}
                  alt={lot.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.badge}>
                  {lot.ticketsSold}/{lot.totalTickets}
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{lot.title}</h3>
                {lot.category && <p className={styles.category}>{lot.category}</p>}
                <div className={styles.priceRow}>
                  <span className={styles.price}>{lot.ticketPrice} ₴</span>
                  <span className={styles.perTicket}>за квиток</span>
                </div>
                <div className={styles.progress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${(lot.ticketsSold / lot.totalTickets) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

