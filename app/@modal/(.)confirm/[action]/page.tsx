"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader/Loader";
import styles from "./confirm.module.css";

type ConfirmAction = "delete-raffle";

export default function ConfirmModalPage() {
  const router = useRouter();
  const params = useParams();
  const action = params?.action as ConfirmAction | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Перешкоджаємо прокрутці тіла під час відкриття модалки
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleConfirm = async () => {
    if (!action) return;

    setIsLoading(true);
    setError(null);

    try {
      // Викликаємо callback через window event перед закриттям
      window.dispatchEvent(new CustomEvent("confirm-action", { detail: { action } }));
      
      // Даємо час для обробки події
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка при виконанні дії");
      setIsLoading(false);
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLoading]);

  const getModalContent = () => {
    switch (action) {
      case "delete-raffle":
        return {
          title: "Видалити лот?",
          message: "Ви впевнені, що хочете видалити цей лот? Цю дію неможливо скасувати.",
          confirmText: "Видалити",
          cancelText: "Скасувати",
          confirmClass: styles.dangerBtn,
        };
      default:
        return {
          title: "Підтвердження",
          message: "Ви впевнені?",
          confirmText: "Підтвердити",
          cancelText: "Скасувати",
          confirmClass: styles.primaryBtn,
        };
    }
  };

  const content = getModalContent();

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} disabled={isLoading}>
          ×
        </button>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.message}>{content.message}</p>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={handleClose}
            disabled={isLoading}
          >
            {content.cancelText}
          </button>
          <button
            className={content.confirmClass}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size="sm" /> Обробка...
              </>
            ) : (
              content.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

