import { requireAdmin } from "@/lib/auth/requireAdmin";
import { mockDb } from "@/lib/store/mockDb";
import { AdminRafflesList } from "./AdminRafflesList";
import styles from "./admin.module.css";

async function getAllRaffles() {
  return mockDb.raffles.findAll();
}

export default async function AdminPage() {
  await requireAdmin(); // Check auth and admin role
  const raffles = await getAllRaffles();
  const pendingRaffles = raffles.filter((r) => r.status === "pending");

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Адмін-панель модерації</h1>
      <p className={styles.subtitle}>
        На модерації: <strong>{pendingRaffles.length}</strong> розіграшів
      </p>

      <AdminRafflesList raffles={raffles} />
    </div>
  );
}

