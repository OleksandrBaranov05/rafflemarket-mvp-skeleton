import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import { mockDb } from "@/lib/store/mockDb";
import styles from "./dashboard.module.css";
import { CreateRaffleButton } from "./CreateRaffleButton";
import { DashboardStats } from "./DashboardStats";
import { Pagination } from "@/components/Pagination/Pagination";
import { DashboardRaffleCard } from "@/components/DashboardRaffleCard/DashboardRaffleCard";

const ITEMS_PER_PAGE = 6;

type SearchParams = Promise<{ page?: string }>;

export const metadata: Metadata = generatePageMetadata({
  title: "Мій кабінет",
  description: "Керування своїми лотами та перегляд статистики",
});

async function getMyRaffles(userId: string, page: number = 1) {
  const allRaffles = mockDb.raffles.findBySeller(userId);
  
  // Сортуємо за датою створення (новіші спочатку)
  const sortedRaffles = [...allRaffles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedRaffles.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRaffles = sortedRaffles.slice(startIndex, endIndex);

  return {
    raffles: paginatedRaffles,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: sortedRaffles.length,
      itemsPerPage: ITEMS_PER_PAGE,
    },
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) return null;

  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const validPage = page > 0 ? page : 1;

  const { raffles: myRaffles, pagination } = await getMyRaffles(session.user.id, validPage);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/profile" className={styles.profileLink}>
            {session.user.avatarUrl ? (
              session.user.avatarUrl.startsWith("data:") ? (
                <img
                  src={session.user.avatarUrl}
                  alt={session.user.name || session.user.email}
                  className={styles.avatar}
                />
              ) : (
                <Image
                  src={session.user.avatarUrl}
                  alt={session.user.name || session.user.email}
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
              )
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.avatarInitial}>
                  {session.user.name?.[0]?.toUpperCase() || session.user.email[0].toUpperCase()}
                </span>
              </div>
            )}
          </Link>
          <div>
            <h1 className={styles.title}>Мій кабінет</h1>
            <p className={styles.subtitle}>
              {session.user.name ? (
                <>
                  <strong>{session.user.name}</strong> ({session.user.email})
                </>
              ) : (
                <>
                  Ви залогінені як: <strong>{session.user.email}</strong>
                </>
              )}
              {" "}• {session.user.role}
            </p>
          </div>
        </div>
        {(session.user.canSell === true || session.user.role === "admin") && (
          <CreateRaffleButton />
        )}
      </div>

      {session.user.role === "admin" && (
        <div className={styles.adminLink}>
          <Link href="/admin" className={styles.adminBtn}>
            Адмін-панель модерації
          </Link>
        </div>
      )}

      <div className={styles.nav}>
        <Link href="/me/tickets" className={styles.navLink}>
          Мої квитки
        </Link>
      </div>

      {(session.user.canSell === true || session.user.role === "admin") && (
        <DashboardStats userId={session.user.id} />
      )}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Мої розіграші</h2>
          {pagination.totalItems > 0 && (
            <p className={styles.sectionSubtitle}>
              Всього: {pagination.totalItems} • Сторінка {pagination.currentPage} з {pagination.totalPages}
            </p>
          )}
        </div>
        {myRaffles.length === 0 ? (
          <div className={styles.empty}>
            <p>У вас поки немає розіграшів.</p>
            {(session.user.role === "seller" || session.user.role === "admin") && (
              <p>Створіть перший лот для розіграшу!</p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {myRaffles.map((raffle) => (
              <DashboardRaffleCard key={raffle.id} raffle={raffle} userId={session.user.id} />
            ))}
          </div>
        )}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath="/dashboard"
          />
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
