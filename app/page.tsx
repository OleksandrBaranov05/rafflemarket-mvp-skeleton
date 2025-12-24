import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Marketplace розіграшів
            <span className={styles.highlight}> реальних товарів</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Прозорі правила. Реальні лоти. Переможець визначається випадково після продажу всіх квитків.
          </p>
          <div className={styles.heroActions}>
            <Link href="/raffles" className={styles.primaryBtn}>
              Переглянути каталог
            </Link>
            <Link href="/login" className={styles.secondaryBtn}>
              Увійти
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Як це працює?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎁</div>
              <h3 className={styles.featureTitle}>Реальні товари</h3>
              <p className={styles.featureText}>
                Користувачі виставляють реальні товари: авто, будинки, техніка, коштовності
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎫</div>
              <h3 className={styles.featureTitle}>Купівля квитків</h3>
              <p className={styles.featureText}>
                Інші користувачі купують квитки за доступною ціною
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎲</div>
              <h3 className={styles.featureTitle}>Випадковий вибір</h3>
              <p className={styles.featureText}>
                Коли всі квитки продані, один переможець обирається випадковим чином
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h3 className={styles.featureTitle}>Отримання призу</h3>
              <p className={styles.featureText}>
                Переможець отримує товар через прозору систему escrow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Готові почати?</h2>
            <p className={styles.ctaText}>
              Перегляньте доступні розіграші або створіть власний лот
            </p>
            <div className={styles.ctaActions}>
              <Link href="/raffles" className={styles.ctaPrimaryBtn}>
                Переглянути лоти
              </Link>
              <Link href="/login" className={styles.ctaSecondaryBtn}>
                Створити лот
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className={styles.quickLinks}>
        <div className={styles.container}>
          <div className={styles.linksGrid}>
            <Link href="/raffles" className={styles.quickLinkCard}>
              <div className={styles.quickLinkIcon}>📋</div>
              <h3 className={styles.quickLinkTitle}>Каталог розіграшів</h3>
              <p className={styles.quickLinkText}>Переглянути всі доступні лоти та купити квитки</p>
            </Link>
            <Link href="/dashboard" className={styles.quickLinkCard}>
              <div className={styles.quickLinkIcon}>👤</div>
              <h3 className={styles.quickLinkTitle}>Мій кабінет</h3>
              <p className={styles.quickLinkText}>Керування своїми лотами та перегляд квитків</p>
            </Link>
            <Link href="/register" className={styles.quickLinkCard}>
              <div className={styles.quickLinkIcon}>✨</div>
              <h3 className={styles.quickLinkTitle}>Реєстрація</h3>
              <p className={styles.quickLinkText}>Створіть акаунт для участі в розіграшах</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
