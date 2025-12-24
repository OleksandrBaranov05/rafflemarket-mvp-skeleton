import Link from "next/link";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import styles from "./payment.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Оплата підтверджена",
  description: "Ваша оплата успішно прийнята",
});

export default function PaymentConfirmationPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>Оплату прийнято!</h1>
        <p className={styles.message}>
          Ваші квитки успішно придбані. Перевірте їх у розділі "Мої квитки".
        </p>
        <div className={styles.actions}>
          <Link href="/me/tickets" className={styles.primaryBtn}>
            Переглянути мої квитки
          </Link>
          <Link href="/raffles" className={styles.secondaryBtn}>
            До каталогу
          </Link>
        </div>
      </div>
    </div>
  );
}

