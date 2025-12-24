export type RaffleStatus = "draft" | "pending" | "active" | "completed" | "cancelled" | "rejected";

export type TicketParticipationStatus = "pending" | "active" | "finished" | "won" | "lost";

export type Raffle = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerEmail: string;
  totalTickets: number;
  ticketsSold: number;
  ticketPrice: number;
  status: RaffleStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  winnerTicketId?: string;
  winnerUserId?: string;
  category?: string;
  platformFeePercent: number;
  maxTicketsPerUser?: number; // Обмеження квитків на користувача
};

export type RaffleWithDetails = Raffle & {
  tickets: Ticket[];
};

export type Ticket = {
  id: string;
  raffleId: string;
  userId: string;
  userEmail: string;
  ticketNumber: number;
  purchasedAt: string;
  isWinner: boolean;
};

export type CreateRaffleInput = {
  title: string;
  description: string;
  imageUrl: string;
  totalTickets: number;
  ticketPrice: number;
  category?: string;
  maxTicketsPerUser?: number;
};

export type BuyTicketsInput = {
  raffleId: string;
  quantity: number;
};

