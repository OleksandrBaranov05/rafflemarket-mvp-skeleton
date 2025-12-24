"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/lib/api/auth/me";
import { queryKeys } from "@/lib/utils/queryKeys";
import { useState } from "react";
import styles from "./CreateRaffleLink.module.css";
import { Loader } from "../Loader/Loader";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function CreateRaffleLink({ className, children }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { data: meData, isLoading } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
  });

  const isLoggedIn = !!meData?.user;
  const canSell = meData?.user?.canSell === true || meData?.user?.role === "admin";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    if (!isLoggedIn || !canSell) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  if (isLoading) {
    return (
      <span className={className}>
        <Loader size="sm" />
      </span>
    );
  }

  if (isLoggedIn && canSell) {
    return (
      <Link href="/dashboard/raffles/new" className={className}>
        {children || "Створити лот"}
      </Link>
    );
  }

  return (
    <>
      <a href="#" className={className} onClick={handleClick}>
        {children || "Створити лот"}
      </a>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
              aria-label="Закрити"
            >
              ×
            </button>
            <h2 className={styles.modalTitle}>Створення розіграшу</h2>
            <p className={styles.modalText}>
              Для створення розіграшу вам потрібно увійти в систему як продавець.
            </p>
            <div className={styles.modalActions}>
              <Link href="/login" className={styles.loginBtn} onClick={() => setShowModal(false)}>
                Увійти
              </Link>
              <Link
                href="/register"
                className={styles.registerBtn}
                onClick={() => setShowModal(false)}
              >
                Зареєструватись
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

