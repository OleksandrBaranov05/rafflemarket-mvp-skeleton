"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRaffle } from "@/lib/api/raffles/delete";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import type { Raffle } from "@/lib/types/raffle";
import { Loader } from "../Loader/Loader";
import styles from "./DashboardRaffleCard.module.css";

type Props = {
  raffle: Raffle;
  userId: string;
};

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    draft: "Чернетка",
    pending: "На модерації",
    active: "Активний",
    completed: "Завершено",
    cancelled: "Скасовано",
    rejected: "Відхилено",
  };
  return map[status] || status;
}

export function DashboardRaffleCard({ raffle, userId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteRaffle(raffle.id),
    onSuccess: () => {
      toast.success("Лот видалено");
      qc.invalidateQueries({ queryKey: queryKeys.raffles.list() });
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Помилка видалення лоту");
    },
  });

  const canEdit = raffle.sellerId === userId && raffle.ticketsSold === 0;
  const canDelete = raffle.sellerId === userId && raffle.ticketsSold === 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Зберігаємо ID лоту для видалення в sessionStorage
    sessionStorage.setItem("pendingDeleteRaffleId", raffle.id);
    router.push(`/confirm/delete-raffle`);
  };

  // Слухаємо подію підтвердження
  React.useEffect(() => {
    const handleConfirm = (event: CustomEvent) => {
      if (event.detail?.action === "delete-raffle") {
        const raffleId = sessionStorage.getItem("pendingDeleteRaffleId");
        if (raffleId === raffle.id) {
          deleteMutation.mutate();
          sessionStorage.removeItem("pendingDeleteRaffleId");
        }
      }
    };

    window.addEventListener("confirm-action", handleConfirm as EventListener);
    return () => {
      window.removeEventListener("confirm-action", handleConfirm as EventListener);
    };
  }, [deleteMutation, raffle.id]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/raffles/${raffle.id}/edit`);
  };

  return (
    <div className={styles.card}>
      <Link href={`/raffles/${raffle.id}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={raffle.imageUrl}
            alt={raffle.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.badge}>{getStatusText(raffle.status)}</div>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{raffle.title}</h3>
          <div className={styles.cardStats}>
            <span>
              {raffle.ticketsSold}/{raffle.totalTickets} квитків
            </span>
            <div className={styles.priceInfo}>
              <span className={styles.price}>{raffle.ticketPrice} ₴</span>
              <span className={styles.priceNote}>за квиток</span>
            </div>
          </div>
          <div className={styles.totalPriceInfo}>
            <span className={styles.totalPriceLabel}>Загальна вартість:</span>
            <span className={styles.totalPrice}>
              {(raffle.totalTickets * raffle.ticketPrice).toLocaleString("uk-UA")} ₴
            </span>
          </div>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
            />
          </div>
        </div>
      </Link>

      {(canEdit || canDelete) && (
        <div className={styles.actions}>
          {canEdit && (
            <button
              className={styles.editBtn}
              onClick={handleEdit}
              disabled={deleteMutation.isPending}
            >
              ✏️ Редагувати
            </button>
          )}
          {canDelete && (
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader size="sm" /> : "🗑️ Видалити"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

