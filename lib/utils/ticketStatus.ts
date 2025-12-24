import type { RaffleStatus, TicketParticipationStatus } from "@/lib/types/raffle";
import type { Raffle, Ticket } from "@/lib/types/raffle";

export function getTicketParticipationStatus(
  raffle: Raffle,
  tickets: Ticket[]
): TicketParticipationStatus {
  if (raffle.status === "pending" || raffle.status === "draft") {
    return "pending";
  }

  if (raffle.status === "active") {
    return "active";
  }

  if (raffle.status === "completed" || raffle.status === "cancelled" || raffle.status === "rejected") {
    // Перевіряємо чи є переможний квиток
    const hasWinner = tickets.some((t) => t.isWinner);
    if (hasWinner && raffle.status === "completed") {
      return "won";
    }
    if (raffle.status === "completed") {
      return "lost";
    }
    return "finished";
  }

  return "finished";
}

