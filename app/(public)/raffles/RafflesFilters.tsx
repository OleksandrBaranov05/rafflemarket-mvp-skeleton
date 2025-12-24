"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RafflesFilters.module.css";

export function RafflesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);
    if (sort !== "newest") params.set("sort", sort);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    router.push(`/raffles?${params.toString()}`);
  };

  const handlePriceMinChange = (value: string) => {
    setPriceMin(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("priceMin", value);
    } else {
      params.delete("priceMin");
    }
    router.push(`/raffles?${params.toString()}`);
  };

  const handlePriceMaxChange = (value: string) => {
    setPriceMax(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("priceMax", value);
    } else {
      params.delete("priceMax");
    }
    router.push(`/raffles?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setSort("newest");
    setPriceMin("");
    setPriceMax("");
    router.push("/raffles");
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`/raffles?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`/raffles?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/raffles?${params.toString()}`);
  };

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Пошук за назвою..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Пошук
        </button>
      </form>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Категорія:</label>
          <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className={styles.select}>
            <option value="all">Всі</option>
            <option value="Автомобілі">Автомобілі</option>
            <option value="Нерухомість">Нерухомість</option>
            <option value="Техніка">Техніка</option>
            <option value="Коштовності">Коштовності</option>
            <option value="Інше">Інше</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Статус:</label>
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className={styles.select}>
            <option value="all">Всі</option>
            <option value="active">Активні</option>
            <option value="completed">Завершені</option>
            <option value="pending">На модерації</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Сортування:</label>
          <select value={sort} onChange={(e) => handleSortChange(e.target.value)} className={styles.select}>
            <option value="newest">Найновіші</option>
            <option value="oldest">Найстаріші</option>
            <option value="price-low">Ціна: низька → висока</option>
            <option value="price-high">Ціна: висока → низька</option>
            <option value="popular">Найпопулярніші</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Ціна квитка:</label>
          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="Від"
              value={priceMin}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              placeholder="До"
              value={priceMax}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />
          </div>
        </div>
      </div>

      <button type="button" onClick={resetFilters} className={styles.resetBtn}>
        Скинути фільтри
      </button>
    </div>
  );
}

