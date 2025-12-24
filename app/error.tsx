"use client";

import styles from "./error.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Сталася помилка</h1>
      <p className={styles.text}>{error.message}</p>
      <button className={styles.btn} onClick={() => reset()}>
        Спробувати ще раз
      </button>
    </div>
  );
}
