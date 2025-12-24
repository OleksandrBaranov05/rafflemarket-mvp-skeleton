import { http } from "@/lib/utils/http";
import type { CreateRaffleInput } from "@/lib/types/raffle";

export type UpdateRaffleResponse = {
  raffle: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    sellerId: string;
    sellerEmail: string;
    totalTickets: number;
    ticketsSold: number;
    ticketPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    category?: string;
    platformFeePercent: number;
    maxTicketsPerUser?: number;
  };
};

export function updateRaffle(id: string, input: Partial<CreateRaffleInput>) {
  return http<UpdateRaffleResponse>(`/api/raffles/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

