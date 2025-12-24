import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/requireSession";
import { getSession } from "@/lib/auth/session";
import { mockDb } from "@/lib/store/mockDb";
import { EditRaffleForm } from "./EditRaffleForm";
import styles from "./edit.module.css";

type Params = Promise<{ id: string }>;

async function getRaffle(id: string) {
  const raffle = mockDb.raffles.findById(id);
  return raffle;
}

export default async function EditRafflePage({ params }: { params: Params }) {
  const session = await requireSession();
  const { id } = await params;
  const raffle = await getRaffle(id);

  if (!raffle) {
    notFound();
  }

  // Перевіряємо права доступу
  if (raffle.sellerId !== session.user.id && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Не дозволяємо редагувати якщо вже є продані квитки
  if (raffle.ticketsSold > 0) {
    redirect(`/raffles/${id}`);
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Редагувати лот</h1>
      <EditRaffleForm initialRaffle={raffle} />
    </div>
  );
}

