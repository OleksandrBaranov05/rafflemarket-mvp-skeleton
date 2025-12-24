export type NotificationType = "ticket_purchased" | "raffle_completed" | "raffle_won" | "escrow_shipped" | "escrow_delivered";

export type NotificationStatus = "unread" | "read";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  raffleId?: string;
  orderId?: string;
  createdAt: string;
  readAt?: string;
};

