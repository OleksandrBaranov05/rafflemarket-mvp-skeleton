import { http } from "@/lib/utils/http";
import type { Raffle } from "@/lib/types/raffle";

export type RafflesBySellerResponse = {
  raffles: Raffle[];
};

export function getRafflesBySeller(sellerId: string) {
  return http<RafflesBySellerResponse>(`/api/raffles/seller/${sellerId}`, { method: "GET" });
}

