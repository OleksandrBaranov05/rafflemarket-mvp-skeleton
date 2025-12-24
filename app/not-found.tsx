import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>404 — Сторінку не знайдено</h1>
      <p className={styles.text}>Можливо, посилання застаріло або сторінка була переміщена.</p>
      <Link className={styles.link} href="/">
        На головну
      </Link>
    </div>
  );
}
