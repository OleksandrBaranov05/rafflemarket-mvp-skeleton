import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              RaffleMarket
            </Link>
            <p className={styles.tagline}>
              Маркетплейс публічних розіграшів реальних товарів
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Навігація</h3>
              <Link href="/raffles" className={styles.link}>
                Каталог розіграшів
              </Link>
              <Link href="/dashboard" className={styles.link}>
                Мій кабінет
              </Link>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Правові документи</h3>
              <Link href="/privacy" className={styles.link}>
                Політика конфіденційності
              </Link>
              <Link href="/terms" className={styles.link}>
                Умови використання
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} RaffleMarket. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}

