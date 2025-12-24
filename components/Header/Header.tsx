"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { me } from "@/lib/api/auth/me";
import { logout } from "@/lib/api/auth/logout";
import { queryKeys } from "@/lib/utils/queryKeys";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader } from "../Loader/Loader";

export function Header() {
  const router = useRouter();
  const qc = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("Ви вийшли");
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Не вдалося вийти");
    },
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" onClick={closeMobileMenu}>
          RaffleMarket
        </Link>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.mobileMenuIcon}>
            {mobileMenuOpen ? "✕" : "☰"}
          </span>
        </button>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <Link className={styles.link} href="/raffles" onClick={closeMobileMenu}>
            Каталог
          </Link>

          {meQuery.isLoading ? (
            <span className={styles.muted}>
              <Loader size="sm" />
            </span>
          ) : meQuery.data?.user ? (
            <>
              <Link className={styles.link} href="/dashboard" onClick={closeMobileMenu}>
                Кабінет
              </Link>
              <Link className={styles.link} href="/profile" onClick={closeMobileMenu}>
                Профіль
              </Link>
              <button
                className={styles.btn}
                onClick={() => {
                  logoutMutation.mutate();
                  closeMobileMenu();
                }}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Вихід..." : "Вийти"}
              </button>
            </>
          ) : (
            <>
              <Link className={styles.link} href="/register" onClick={closeMobileMenu}>
                Реєстрація
              </Link>
              <Link className={styles.btnLink} href="/login" onClick={closeMobileMenu}>
                Увійти
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
