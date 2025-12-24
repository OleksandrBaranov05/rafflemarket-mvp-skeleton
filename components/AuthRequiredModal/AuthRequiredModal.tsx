"use client";

import React from "react";
import Link from "next/link";
import styles from "./AuthRequiredModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
};

export function AuthRequiredModal({ isOpen, onClose, message }: Props) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Потрібна авторизація</h2>
        <p className={styles.message}>
          {message || "Для цієї дії необхідно увійти в систему або зареєструватися."}
        </p>
        <div className={styles.actions}>
          <Link href="/auth/login" className={styles.loginBtn} onClick={onClose}>
            Увійти
          </Link>
          <Link href="/auth/register" className={styles.registerBtn} onClick={onClose}>
            Реєстрація
          </Link>
        </div>
      </div>
    </div>
  );
}

