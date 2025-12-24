import { http } from "@/lib/utils/http";
import type { Raffle, Ticket } from "@/lib/types/raffle";

export type RaffleDetailResponse = {
  raffle: Raffle;
  tickets: Ticket[];
};

export function getRaffleById(id: string) {
  return http<RaffleDetailResponse>(`/api/raffles/${id}`, { method: "GET" });
}

