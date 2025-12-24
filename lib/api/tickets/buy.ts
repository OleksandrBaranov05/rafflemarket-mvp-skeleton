import { http } from "@/lib/utils/http";
import type { BuyTicketsInput, Ticket } from "@/lib/types/raffle";
import type { Order } from "@/lib/types/order";

export type BuyTicketsResponse = {
  order: Order;
  tickets: Ticket[];
};

export function buyTickets(input: BuyTicketsInput) {
  return http<BuyTicketsResponse>("/api/tickets/buy", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

