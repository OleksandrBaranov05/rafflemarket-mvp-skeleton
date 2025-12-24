"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./HeroBlock.module.css";

export function HeroBlock() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/raffles?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/raffles");
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Marketplace розіграшів
          <span className={styles.highlight}> реальних товарів</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Прозорі правила. Реальні лоти. Переможець визначається випадково після продажу всіх квитків.
        </p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Пошук лотів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Пошук
          </button>
        </form>

        <div className={styles.heroActions}>
          <a href="/raffles" className={styles.primaryBtn}>
            Переглянути каталог
          </a>
          <a href="/register" className={styles.secondaryBtn}>
            Реєстрація
          </a>
        </div>
      </div>
    </section>
  );
}

