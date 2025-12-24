import Link from "next/link";
import Image from "next/image";
import { requireSession } from "@/lib/auth/requireSession";
import { mockDb } from "@/lib/store/mockDb";
import { getTicketParticipationStatus } from "@/lib/utils/ticketStatus";
import type { TicketParticipationStatus } from "@/lib/types/raffle";
import { MyTicketsList } from "./MyTicketsList";
import styles from "./tickets.module.css";

async function getMyTicketsWithStatus(userId: string) {
  const tickets = mockDb.tickets.findByUser(userId);

  // Групуємо по лотах та визначаємо статуси
  const grouped = tickets.reduce((acc, ticket) => {
    const raffleId = ticket.raffleId;
    if (!acc[raffleId]) {
      const raffle = mockDb.raffles.findById(raffleId);
      if (raffle) {
        acc[raffleId] = {
          raffle,
          tickets: [],
        };
      }
    }
    if (acc[raffleId]) {
      acc[raffleId].tickets.push(ticket);
    }
    return acc;
  }, {} as Record<string, { raffle: any; tickets: typeof tickets }>);

  // Додаємо статус участі для кожного групування
  return Object.values(grouped).map((group) => {
    const status = getTicketParticipationStatus(group.raffle, group.tickets);
    return {
      ...group,
      participationStatus: status,
    };
  });
}

export default async function MyTicketsPage() {
  const session = await requireSession();
  const participations = await getMyTicketsWithStatus(session.user.id);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Назад до кабінету</Link>
        <h1 className={styles.title}>Мої квитки</h1>
        <p className={styles.subtitle}>
          Всього участей: <strong>{participations.length}</strong>
        </p>
      </div>

      <MyTicketsList participations={participations} />
    </div>
  );
}

