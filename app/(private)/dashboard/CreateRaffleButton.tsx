"use client";

import { useRouter } from "next/navigation";
import styles from "./CreateRaffleButton.module.css";

export function CreateRaffleButton() {
  const router = useRouter();

  return (
    <button className={styles.btn} onClick={() => router.push("/dashboard/raffles/new")}>
      + Створити розіграш
    </button>
  );
}

