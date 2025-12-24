"use client";

import { useQuery } from "@tanstack/react-query";
import { me } from "@/lib/api/auth/me";
import { MyTickets } from "./MyTickets";
import { queryKeys } from "@/lib/utils/queryKeys";

type Props = {
  raffleId: string;
};

export function MyTicketsWrapper({ raffleId }: Props) {
  const { data: userData } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
  });

  if (!userData?.user) {
    return null;
  }

  return <MyTickets raffleId={raffleId} userId={userData.user.id} />;
}

