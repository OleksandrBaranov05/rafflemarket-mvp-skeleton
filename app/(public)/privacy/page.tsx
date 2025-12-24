import styles from "./privacy.module.css";

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.title}>Політика конфіденційності</h1>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Загальні положення</h2>
            <p>
              Ця Політика конфіденційності описує, як RaffleMarket збирає, використовує та захищає
              персональну інформацію користувачів платформи.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Збір інформації</h2>
            <p>Ми збираємо наступну інформацію:</p>
            <ul>
              <li>Email адреса для реєстрації та входу</li>
              <li>Ім'я користувача (опціонально)</li>
              <li>Фотографія профілю (опціонально)</li>
              <li>Інформація про транзакції та участь у розіграшах</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Використання інформації</h2>
            <p>
              Ваша персональна інформація використовується для надання послуг платформи, обробки
              транзакцій, комунікації з користувачами та забезпечення безпеки.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Захист даних</h2>
            <p>
              Ми вживаємо заходів для захисту вашої персональної інформації від несанкціонованого
              доступу, втрати або знищення.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Контакти</h2>
            <p>
              З питань конфіденційності звертайтесь за адресою:{" "}
              <a href="mailto:privacy@rafflemarket.com">privacy@rafflemarket.com</a>
            </p>
          </section>

          <p className={styles.lastUpdated}>Останнє оновлення: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

