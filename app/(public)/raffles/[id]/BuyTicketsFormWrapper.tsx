"use client";

import { useQuery } from "@tanstack/react-query";
import { getTicketsByUser } from "@/lib/api/tickets/getByUser";
import { queryKeys } from "@/lib/utils/queryKeys";
import { me } from "@/lib/api/auth/me";
import { BuyTicketsForm } from "./BuyTicketsForm";
import type { Raffle } from "@/lib/types/raffle";

type Props = {
  raffle: Raffle;
  ticketsAvailable: number;
};

export function BuyTicketsFormWrapper({ raffle, ticketsAvailable }: Props) {
  const { data: userData } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
  });

  const { data: ticketsData } = useQuery({
    queryKey: queryKeys.tickets.byUser(userData?.user?.id || ""),
    queryFn: () => {
      if (!userData?.user) throw new Error("User not found");
      return getTicketsByUser(userData.user.id);
    },
    enabled: !!userData?.user,
  });

  const userTicketsCount =
    ticketsData?.tickets?.filter((t) => t.raffleId === raffle.id).length || 0;

  return (
    <BuyTicketsForm
      raffle={raffle}
      ticketsAvailable={ticketsAvailable}
      userTicketsCount={userTicketsCount}
    />
  );
}

