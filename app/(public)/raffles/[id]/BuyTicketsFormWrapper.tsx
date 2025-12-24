"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTicketsByUser } from "@/lib/api/tickets/getByUser";
import { queryKeys } from "@/lib/utils/queryKeys";
import { me } from "@/lib/api/auth/me";
import { BuyTicketsForm } from "./BuyTicketsForm";
import { AuthRequiredModal } from "@/components/AuthRequiredModal/AuthRequiredModal";
import { Loader } from "@/components/Loader/Loader";
import type { Raffle } from "@/lib/types/raffle";
import styles from "./BuyTicketsFormWrapper.module.css";

type Props = {
  raffle: Raffle;
  ticketsAvailable: number;
};

export function BuyTicketsFormWrapper({ raffle, ticketsAvailable }: Props) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { data: userData, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <>
        <div className={styles.authRequired}>
          <p>Для купівлі квитків необхідно увійти в систему.</p>
          <button
            className={styles.loginButton}
            onClick={() => setShowAuthModal(true)}
          >
            Увійти або зареєструватися
          </button>
        </div>
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

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

