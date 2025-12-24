import { http } from "@/lib/utils/http";
import type { Ticket } from "@/lib/types/raffle";

export type TicketsByUserResponse = {
  tickets: Ticket[];
};

export function getTicketsByUser(userId: string) {
  return http<TicketsByUserResponse>(`/api/tickets/user/${userId}`, { method: "GET" });
}

