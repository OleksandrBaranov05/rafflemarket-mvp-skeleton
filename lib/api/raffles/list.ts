import { http } from "@/lib/utils/http";
import type { Raffle } from "@/lib/types/raffle";

export type RafflesListResponse = {
  raffles: Raffle[];
};

export function listRaffles() {
  return http<RafflesListResponse>("/api/raffles", { method: "GET" });
}

