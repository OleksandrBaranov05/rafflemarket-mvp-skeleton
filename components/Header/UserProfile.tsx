"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/lib/api/auth/me";
import { queryKeys } from "@/lib/utils/queryKeys";
import styles from "./UserProfile.module.css";

export function UserProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: meData } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
  });

  const user = meData?.user;

  // Закриваємо dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!user) return null;

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";
  const avatarUrl = user.avatarUrl || defaultAvatar;
  const displayName = user.name || user.email;

  return (
    <div className={styles.userProfile} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Профіль користувача"
        aria-expanded={dropdownOpen}
      >
        <div className={styles.avatarWrapper}>
          {user.avatarUrl ? (
            user.avatarUrl.startsWith("data:") ? (
              <img src={user.avatarUrl} alt={displayName} className={styles.avatar} />
            ) : (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                width={32}
                height={32}
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
        <div className={styles.userInfo}>
          <span className={styles.userName}>{displayName}</span>
          {user.balance !== undefined && (
            <span className={styles.balanceBadge}>
              {(user.balance || 0).toLocaleString("uk-UA")} ₴
            </span>
          )}
        </div>
        <span className={styles.chevron}>{dropdownOpen ? "▲" : "▼"}</span>
      </button>

      {dropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownAvatar}>
              {user.avatarUrl ? (
                user.avatarUrl.startsWith("data:") ? (
                  <img src={user.avatarUrl} alt={displayName} className={styles.avatarLarge} />
                ) : (
                  <Image
                    src={user.avatarUrl}
                    alt={displayName}
                    width={48}
                    height={48}
                    className={styles.avatarLarge}
                  />
                )
              ) : (
                <div className={styles.avatarPlaceholderLarge}>
                  <span className={styles.avatarInitialLarge}>
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.dropdownInfo}>
              <div className={styles.dropdownName}>{displayName}</div>
              <div className={styles.dropdownEmail}>{user.email}</div>
              {user.balance !== undefined && (
                <div className={styles.balance}>
                  💰 {(user.balance || 0).toLocaleString("uk-UA")} ₴
                </div>
              )}
            </div>
          </div>
          <div className={styles.dropdownDivider} />
          <Link
            href="/profile"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            👤 Мій профіль
          </Link>
          <Link
            href="/dashboard"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            📊 Кабінет
          </Link>
          <Link
            href="/me/tickets"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            🎫 Мої квитки
          </Link>
        </div>
      )}
    </div>
  );
}

