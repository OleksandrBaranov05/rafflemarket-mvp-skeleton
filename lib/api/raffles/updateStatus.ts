import { http } from "@/lib/utils/http";
import type { Raffle, RaffleStatus } from "@/lib/types/raffle";

export type UpdateRaffleStatusInput = {
  status: RaffleStatus;
};

export type UpdateRaffleStatusResponse = {
  raffle: Raffle;
};

export function updateRaffleStatus(raffleId: string, input: UpdateRaffleStatusInput) {
  return http<UpdateRaffleStatusResponse>(`/api/raffles/${raffleId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

