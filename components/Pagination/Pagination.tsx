"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

export function Pagination({ currentPage, totalPages, basePath = "" }: Props) {
  const searchParams = useSearchParams();
  
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    return `${basePath}${query ? `?${query}` : ""}`;
  };

  const pages: (number | "ellipsis")[] = [];
  
  // Логіка відображення номерів сторінок
  if (totalPages <= 7) {
    // Показуємо всі сторінки якщо їх <= 7
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Складна логіка для більшої кількості сторінок
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("ellipsis");
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }
    
    pages.push(totalPages);
  }

  return (
    <nav className={styles.pagination} aria-label="Навігація по сторінкам">
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`${styles.pageLink} ${currentPage === 1 ? styles.disabled : ""}`}
        aria-label="Попередня сторінка"
      >
        ← Попередня
      </Link>

      <div className={styles.pageNumbers}>
        {pages.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`${styles.pageNumber} ${currentPage === page ? styles.active : ""}`}
              aria-label={`Сторінка ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        href={createPageUrl(currentPage + 1)}
        className={`${styles.pageLink} ${currentPage === totalPages ? styles.disabled : ""}`}
        aria-label="Наступна сторінка"
      >
        Наступна →
      </Link>
    </nav>
  );
}

