export type EscrowStatus = "pending" | "funded" | "in_escrow" | "shipped" | "delivered" | "released" | "refunded";

export type EscrowUpdate = {
  orderId: string;
  status: EscrowStatus;
  shippedAt?: string;
  deliveredAt?: string;
  releasedAt?: string;
  trackingNumber?: string;
};

