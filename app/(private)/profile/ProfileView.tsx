"use client";

import Image from "next/image";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import styles from "./ProfileView.module.css";

type Props = {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role: string;
  };
};

export function ProfileView({ user }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";
  const avatarUrl = user.avatarUrl || defaultAvatar;

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {user.avatarUrl ? (
                user.avatarUrl.startsWith("data:") ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.email}
                    className={styles.avatar}
                  />
                ) : (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || user.email}
                    width={150}
                    height={150}
                    className={styles.avatar}
                  />
                )
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span className={styles.avatarInitial}>
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.info}>
            <h1 className={styles.name}>{user.name || user.email}</h1>
            <p className={styles.email}>{user.email}</p>
            <span className={styles.role}>{user.role}</span>
          </div>

          <button
            className={styles.editButton}
            onClick={() => setIsEditModalOpen(true)}
          >
            ✏️ Змінити профіль
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValue}>{user.email}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Ім'я:</span>
            <span className={styles.detailValue}>{user.name || "Не вказано"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Роль:</span>
            <span className={styles.detailValue}>{user.role}</span>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          initialName={user.name}
          initialAvatarUrl={user.avatarUrl}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}

