export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  raffles: {
    all: () => ["raffles"] as const,
    detail: (id: string) => ["raffles", id] as const,
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
