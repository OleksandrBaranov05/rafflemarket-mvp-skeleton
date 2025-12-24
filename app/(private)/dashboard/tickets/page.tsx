import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./tickets.module.css";

async function getMyTickets(userId: string) {
  const tickets = mockDb.tickets.findByUser(userId);
  
  return tickets.map((ticket) => {
    const raffle = mockDb.raffles.findById(ticket.raffleId);
    return {
      ...ticket,
      raffle: raffle || null,
    };
  });
}

export default async function MyTicketsPage() {
  const session = await getSession();
  if (!session) return null;

  const tickets = await getMyTickets(session.user.id);

  // Групуємо квитки по лотах
  const ticketsByRaffle = tickets.reduce((acc, ticket) => {
    const raffleId = ticket.raffleId;
    if (!acc[raffleId]) {
      acc[raffleId] = {
        raffle: ticket.raffle,
        tickets: [],
      };
    }
    acc[raffleId].tickets.push(ticket);
    return acc;
  }, {} as Record<string, { raffle: any; tickets: typeof tickets }>);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Назад до кабінету</Link>
        <h1 className={styles.title}>Мої квитки</h1>
        <p className={styles.subtitle}>Всього квитків: <strong>{tickets.length}</strong></p>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.empty}>
          <p>У вас поки немає придбаних квитків.</p>
          <Link href="/raffles" className={styles.browseLink}>Переглянути каталог</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {Object.values(ticketsByRaffle).map(({ raffle, tickets: raffleTickets }) => (
            <div key={raffle?.id || "unknown"} className={styles.card}>
              {raffle ? (
                <>
                  <Link href={`/raffles/${raffle.id}`} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={raffle.imageUrl}
                        alt={raffle.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  </Link>
                  <div className={styles.content}>
                    <Link href={`/raffles/${raffle.id}`} className={styles.raffleLink}>
                      <h3 className={styles.raffleTitle}>{raffle.title}</h3>
                    </Link>
                    <div className={styles.status}>
                      Статус: <span className={styles.statusValue}>{getRaffleStatusText(raffle.status)}</span>
                    </div>
                    <div className={styles.ticketsInfo}>
                      <p className={styles.ticketsCount}>Ваших квитків: <strong>{raffleTickets.length}</strong></p>
                      <div className={styles.ticketNumbers}>
                        {raffleTickets.map((ticket) => (
                          <span
                            key={ticket.id}
                            className={`${styles.ticketNumber} ${ticket.isWinner ? styles.winner : ""}`}
                          >
                            #{ticket.ticketNumber}
                            {ticket.isWinner && " 🎉"}
                          </span>
                        ))}
                      </div>
                      {raffle.status === "completed" && raffleTickets.some((t) => t.isWinner) && (
                        <div className={styles.winnerMessage}>
                          🎊 Вітаємо! Ви перемогли в цьому розіграші!
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.content}>
                  <p className={styles.error}>Лот більше не існує</p>
                  <div className={styles.ticketNumbers}>
                    {raffleTickets.map((ticket) => (
                      <span key={ticket.id} className={styles.ticketNumber}>
                        #{ticket.ticketNumber}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getRaffleStatusText(status: string): string {
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

