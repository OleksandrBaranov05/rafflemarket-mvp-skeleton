import Link from "next/link";
import { Metadata } from "next";
import { HeroBlock } from "@/components/HeroBlock/HeroBlock";
import { FeaturedLotsBlock } from "@/components/FeaturedLotsBlock/FeaturedLotsBlock";
import { WinnersBlock } from "@/components/WinnersBlock/WinnersBlock";
import { CreateRaffleLink } from "@/components/CreateRaffleLink/CreateRaffleLink";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import styles from "./home.module.css";

export const metadata: Metadata = generatePageMetadata({
  title: "Головна",
  description:
    "Маркетплейс публічних розіграшів реальних товарів. Створюйте лоти, купуйте квитки та вигравайте призи!",
});

export default function HomePage() {
  return (
    <>
      {/* Hero Section з пошуком */}
      <HeroBlock />

      {/* Featured Lots Section */}
      <FeaturedLotsBlock />

      {/* How It Works Section */}
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

      {/* Winners Section */}
      <WinnersBlock />

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
              <CreateRaffleLink className={styles.ctaSecondaryBtn}>
                Створити лот
              </CreateRaffleLink>
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
