export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  raffles: {
    list: (searchParams?: string) => ["raffles", "list", searchParams || ""] as const,
    detail: (id: string) => ["raffles", "detail", id] as const,
    bySeller: (sellerId: string) => ["raffles", "seller", sellerId] as const,
  },
  tickets: {
    byRaffle: (raffleId: string) => ["tickets", "raffle", raffleId] as const,
    byUser: (userId: string) => ["tickets", "user", userId] as const,
  },
  orders: {
    byUser: (userId: string) => ["orders", "user", userId] as const,
    detail: (id: string) => ["orders", id] as const,
  },
};
