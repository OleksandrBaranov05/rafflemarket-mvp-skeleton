"use client";

import Image from "next/image";
import Link from "next/link";
import { updateRaffleStatus } from "@/lib/api/raffles/updateStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Raffle, RaffleStatus } from "@/lib/types/raffle";
import { Loader } from "@/components/Loader/Loader";
import styles from "./AdminRafflesList.module.css";

type Props = {
  raffles: Raffle[];
};

export function AdminRafflesList({ raffles }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RaffleStatus }) =>
      updateRaffleStatus(id, { status }),
    onSuccess: () => {
      toast.success("Статус оновлено");
      qc.invalidateQueries({ queryKey: queryKeys.raffles.list() });
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Помилка оновлення статусу");
    },
  });

  const handleStatusChange = (raffleId: string, status: RaffleStatus) => {
    updateMutation.mutate({ id: raffleId, status });
  };

  const pendingRaffles = raffles.filter((r) => r.status === "pending");
  const otherRaffles = raffles.filter((r) => r.status !== "pending");

  return (
    <div className={styles.wrap}>
      {pendingRaffles.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>На модерації ({pendingRaffles.length})</h2>
          <div className={styles.grid}>
            {pendingRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onStatusChange={handleStatusChange}
                isUpdating={updateMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Всі розіграші ({otherRaffles.length})</h2>
        {otherRaffles.length === 0 ? (
          <div className={styles.empty}>Немає інших розіграшів</div>
        ) : (
          <div className={styles.grid}>
            {otherRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onStatusChange={handleStatusChange}
                isUpdating={updateMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type RaffleCardProps = {
  raffle: Raffle;
  onStatusChange: (id: string, status: RaffleStatus) => void;
  isUpdating: boolean;
};

function RaffleCard({ raffle, onStatusChange, isUpdating }: RaffleCardProps) {
  return (
    <div className={styles.card}>
      <Link href={`/raffles/${raffle.id}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={raffle.imageUrl}
            alt={raffle.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className={styles.cardContent}>
        <Link href={`/raffles/${raffle.id}`} className={styles.titleLink}>
          <h3 className={styles.cardTitle}>{raffle.title}</h3>
        </Link>

        <div className={styles.info}>
          <span className={styles.status}>Статус: {getStatusText(raffle.status)}</span>
          <span className={styles.seller}>Продавець: {raffle.sellerEmail}</span>
          <span className={styles.progress}>
            {raffle.ticketsSold}/{raffle.totalTickets} квитків
          </span>
        </div>

        {raffle.status === "pending" && (
          <div className={styles.actions}>
            <button
              className={styles.approveBtn}
              onClick={() => onStatusChange(raffle.id, "active")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader size="sm" /> : "✅ Затвердити"}
            </button>
            <button
              className={styles.rejectBtn}
              onClick={() => onStatusChange(raffle.id, "rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader size="sm" /> : "❌ Відхилити"}
            </button>
          </div>
        )}

        {raffle.status === "active" && (
          <button
            className={styles.cancelBtn}
            onClick={() => onStatusChange(raffle.id, "cancelled")}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader size="sm" /> : "Скасувати"}
          </button>
        )}
      </div>
    </div>
  );
}

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

