import { http } from "@/lib/utils/http";
import type { CreateRaffleInput, Raffle } from "@/lib/types/raffle";

export type CreateRaffleResponse = {
  raffle: Raffle;
};

export function createRaffle(input: CreateRaffleInput) {
  return http<CreateRaffleResponse>("/api/raffles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

