import { CreateRaffleForm } from "./CreateRaffleForm";
import styles from "./new.module.css";

export default function CreateRafflePage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Створити новий розіграш</h1>
      <CreateRaffleForm />
    </div>
  );
}

