import styles from "./terms.module.css";

export default function TermsPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.title}>Умови використання</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Прийняття умов</h2>
            <p>
              Використовуючи платформу RaffleMarket, ви приймаєте та погоджуєтесь дотримуватися
              цих Умов використання.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Використання платформи</h2>
            <p>Користувачі зобов'язуються:</p>
            <ul>
              <li>Надавати достовірну інформацію при реєстрації</li>
              <li>Використовувати платформу відповідно до призначення</li>
              <li>Не порушувати права інших користувачів</li>
              <li>Дотримуватися правил проведення розіграшів</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Розіграші</h2>
            <p>
              Всі розіграші проводяться на прозорих умовах. Переможець визначається випадковим
              чином після продажу всіх квитків.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Комісії</h2>
            <p>
              Платформа стягує комісію з кожного розіграшу згідно з встановленими тарифами.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Відповідальність</h2>
            <p>
              Платформа не несе відповідальності за якість товарів, що виставляються продавцями.
              Всі спори між учасниками вирішуються згідно з правилами платформи.
            </p>
          </section>

          <p className={styles.lastUpdated}>Останнє оновлення: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

