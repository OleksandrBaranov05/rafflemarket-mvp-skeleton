"use client";

import { useQuery } from "@tanstack/react-query";
import { getTicketsByUser } from "@/lib/api/tickets/getByUser";
import { queryKeys } from "@/lib/utils/queryKeys";
import { Loader } from "@/components/Loader/Loader";
import styles from "./MyTickets.module.css";

type Props = {
  raffleId: string;
  userId: string;
};

export function MyTickets({ raffleId, userId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.tickets.byUser(userId),
    queryFn: () => getTicketsByUser(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <Loader size="sm" />
      </div>
    );
  }

  const myTickets = data?.tickets.filter((t) => t.raffleId === raffleId) || [];

  if (myTickets.length === 0) {
    return null;
  }

  const winnerTicket = myTickets.find((t) => t.isWinner);

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Ваші квитки в цьому розіграші</h3>
      <div className={styles.info}>
        <p className={styles.count}>Всього ваших квитків: <strong>{myTickets.length}</strong></p>
        <div className={styles.ticketNumbers}>
          {myTickets.map((ticket) => (
            <span
              key={ticket.id}
              className={`${styles.ticketNumber} ${ticket.isWinner ? styles.winner : ""}`}
            >
              #{ticket.ticketNumber}
              {ticket.isWinner && " 🎉"}
            </span>
          ))}
        </div>
        {winnerTicket && (
          <div className={styles.winnerMessage}>
            🎊 Вітаємо! Ви перемогли в цьому розіграші!
          </div>
        )}
      </div>
    </div>
  );
}

