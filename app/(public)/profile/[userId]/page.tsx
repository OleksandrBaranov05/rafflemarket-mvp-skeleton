import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import { mockDb } from "@/lib/store/mockDb";
import { SellerProfile } from "./SellerProfile";
import styles from "./seller.module.css";

type Params = Promise<{ userId: string }>;

async function getSellerData(userId: string) {
  const user = mockDb.users.findById(userId);
  if (!user) return null;

  const raffles = mockDb.raffles.findBySeller(userId);
  const completedRaffles = raffles.filter((r) => r.status === "completed");
  const activeRaffles = raffles.filter((r) => r.status === "active");

  return {
    user,
    stats: {
      totalRaffles: raffles.length,
      completedRaffles: completedRaffles.length,
      activeRaffles: activeRaffles.length,
      successRate: raffles.length > 0 ? Math.round((completedRaffles.length / raffles.length) * 100) : 0,
    },
    raffles: raffles.slice(0, 6), // Останні 6 лотів для попереднього перегляду
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { userId } = await params;
  const data = await getSellerData(userId);

  if (!data) {
    return generatePageMetadata({
      title: "Профіль не знайдено",
      description: "Продавець не існує",
    });
  }

  const { user, stats } = data;

  return generatePageMetadata({
    title: `Профіль продавця: ${user.name || user.email}`,
    description: `${stats.totalRaffles} розіграшів, ${stats.completedRaffles} завершених. Успішність: ${stats.successRate}%`,
  });
}

export default async function SellerProfilePage({ params }: { params: Params }) {
  const { userId } = await params;
  const data = await getSellerData(userId);

  if (!data) {
    notFound();
  }

  return (
    <div className={styles.wrap}>
      <SellerProfile data={data} />
    </div>
  );
}

