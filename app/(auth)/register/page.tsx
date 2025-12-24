import styles from "./register.module.css";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Реєстрація</h1>
      <p className={styles.subtitle}>Створіть новий акаунт для участі в розіграшах</p>
      <RegisterForm />
      <p className={styles.loginLink}>
        Вже маєте акаунт? <Link href="/login">Увійти</Link>
      </p>
    </div>
  );
}

