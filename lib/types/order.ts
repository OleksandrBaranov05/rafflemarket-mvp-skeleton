import type { EscrowStatus } from "./escrow";

export type OrderStatus = "pending" | "paid" | "completed" | "cancelled" | "refunded";

export type Order = {
  id: string;
  userId: string;
  raffleId: string;
  ticketIds: string[];
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  escrowStatus?: EscrowStatus;
  shippedAt?: string;
  deliveredAt?: string;
  releasedAt?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
};

