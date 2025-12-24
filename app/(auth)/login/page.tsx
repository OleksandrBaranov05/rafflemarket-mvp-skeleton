import Link from "next/link";
import styles from "./login.module.css";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Вхід</h1>
      <p className={styles.subtitle}>Увійдіть у свій акаунт</p>
      <LoginForm />
      <p className={styles.registerLink}>
        Немає акаунта? <Link href="/register">Зареєструватись</Link>
      </p>
    </div>
  );
}
