import { http } from "@/lib/utils/http";

export type DeleteRaffleResponse = {
  message: string;
};

export function deleteRaffle(id: string) {
  return http<DeleteRaffleResponse>(`/api/raffles/${id}`, {
    method: "DELETE",
  });
}

