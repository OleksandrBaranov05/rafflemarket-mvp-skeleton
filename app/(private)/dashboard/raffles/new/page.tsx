import { requireSession } from "@/lib/auth/requireSession";
import { redirect } from "next/navigation";
import { CreateRaffleForm } from "./CreateRaffleForm";
import styles from "./new.module.css";

export default async function CreateRafflePage() {
  const session = await requireSession();

  // Перевіряємо, чи користувач може продавати (через canSell або роль admin)
  const canSell = session.user.canSell === true || session.user.role === "admin";
  if (!canSell) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Створити новий розіграш</h1>
      <CreateRaffleForm />
    </div>
  );
}
