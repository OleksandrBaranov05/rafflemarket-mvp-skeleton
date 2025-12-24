"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProfile } from "@/lib/api/profile/update";
import { me } from "@/lib/api/auth/me";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader/Loader";
import styles from "./ProfilePage.module.css";

type Values = {
  name: string;
  avatarFile: File | null;
  canSell: boolean;
};

const Schema = Yup.object({
  name: Yup.string().max(100, "Максимум 100 символів"),
});

type Props = {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role: "user" | "seller" | "admin";
    canSell?: boolean;
    balance?: number;
  };
};

export function ProfilePage({ user: initialUser }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Отримуємо актуальні дані користувача через React Query
  const { data: meData, isLoading: isLoadingUser } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
    initialData: { user: initialUser },
  });

  const user = (meData?.user || initialUser) as typeof initialUser;
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);

  // Оновлюємо previewUrl коли змінюється user
  useEffect(() => {
    if (user.avatarUrl) {
      setPreviewUrl(user.avatarUrl);
    }
  }, [user.avatarUrl]);

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      let avatarUrl: string | undefined = user.avatarUrl;

      // Якщо вибрано файл, конвертуємо його в base64
      if (values.avatarFile) {
        avatarUrl = await fileToBase64(values.avatarFile);
      }
      // Якщо файл не вибрано, залишаємо поточний avatarUrl (не змінюємо)

      return updateProfile({
        name: values.name.trim() || undefined, // Видаляємо пробіли
        avatarUrl: avatarUrl,
        canSell: values.canSell,
      });
    },
    onSuccess: async (data) => {
      // Оновлюємо кеш React Query з новими даними
      await qc.setQueryData(queryKeys.auth.me(), data);
      await qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("Профіль оновлено");
      setIsEditing(false);
      // Оновлюємо previewUrl на новий аватар
      if (data.user.avatarUrl) {
        setPreviewUrl(data.user.avatarUrl);
      } else {
        setPreviewUrl(null);
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Помилка оновлення профілю";
      toast.error(msg);
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (file: File | null, setFieldValue: (field: string, value: any) => void) => {
    if (file) {
      // Валідація типу файлу
      if (!file.type.startsWith("image/")) {
        toast.error("Будь ласка, оберіть зображення");
        return;
      }

      // Валідація розміру (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Розмір файлу не повинен перевищувати 5MB");
        return;
      }

      setFieldValue("avatarFile", file);

      // Створюємо preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";
  const avatarToShow = previewUrl || user.avatarUrl || defaultAvatar;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      user: "Користувач",
      seller: "Продавець",
      admin: "Адміністратор",
    };
    return labels[role] || role;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        {/* Header секція з аватаром */}
        <div className={styles.headerSection}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {isEditing ? (
                avatarToShow.startsWith("data:") ? (
                  <img src={avatarToShow} alt="Аватар" className={styles.avatar} />
                ) : (
                  <Image
                    src={avatarToShow}
                    alt="Аватар"
                    width={150}
                    height={150}
                    className={styles.avatar}
                  />
                )
              ) : user.avatarUrl ? (
                user.avatarUrl.startsWith("data:") ? (
                  <img src={user.avatarUrl} alt={user.name || user.email} className={styles.avatar} />
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

          <div className={styles.infoSection}>
            {isEditing ? (
              <Formik<Values>
                key={user.id + user.name + user.avatarUrl} // Ре-рендеримо форму при зміні user
                initialValues={{
                  name: user.name || "",
                  avatarFile: null,
                  canSell: user.canSell ?? false,
                }}
                enableReinitialize
                validationSchema={Schema}
                onSubmit={(values) => mutation.mutate(values)}
              >
                {(formik) => {
                  return (
                    <Form className={styles.editForm}>
                      <div className={styles.field}>
                        <label htmlFor="avatarFileInput" className={styles.label}>
                          Фотографія профілю
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(file, formik.setFieldValue);
                          }}
                          className={styles.fileInput}
                          id="avatarFileInput"
                        />
                        <label htmlFor="avatarFileInput" className={styles.fileLabel}>
                          📷 Вибрати фото
                        </label>
                        <p className={styles.hint}>JPG, PNG до 5MB</p>
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>
                          Ім'я
                        </label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className={styles.input}
                          placeholder="Введіть ваше ім'я"
                        />
                        <ErrorMessage name="name" component="div" className={styles.error} />
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <div className={styles.emailDisplay}>{user.email}</div>
                        <p className={styles.hint}>Email не можна змінити</p>
                      </div>

                      <div className={styles.field}>
                        <div className={styles.switchField}>
                          <label className={styles.switchLabel}>
                            <Field
                              type="checkbox"
                              name="canSell"
                              className={styles.switchInput}
                            />
                            <span className={styles.switchText}>
                              Режим продавця: {formik.values.canSell ? "Увімкнено" : "Вимкнено"}
                            </span>
                          </label>
                          <p className={styles.hint}>
                            Увімкніть, щоб створювати та продавати лоти
                          </p>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.cancelBtn}
                          onClick={() => {
                            setIsEditing(false);
                            setPreviewUrl(user.avatarUrl || null);
                            // Скидаємо форму до початкових значень
                            formik.resetForm();
                          }}
                          disabled={mutation.isPending}
                        >
                          Скасувати
                        </button>
                        <button
                          type="submit"
                          className={styles.saveBtn}
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending ? (
                            <span className={styles.btnRow}>
                              <Loader size="sm" /> Збереження...
                            </span>
                          ) : (
                            "💾 Зберегти зміни"
                          )}
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            ) : (
              <>
                <h1 className={styles.name}>{user.name || user.email}</h1>
                <p className={styles.email}>{user.email}</p>
                {user.balance !== undefined && (
                  <div className={styles.balanceDisplay}>
                    💰 Баланс: <span className={styles.balanceAmount}>{(user.balance || 0).toLocaleString("uk-UA")} ₴</span>
                  </div>
                )}
                <div className={styles.meta}>
                  <span className={styles.role}>{getRoleLabel(user.role)}</span>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Редагувати профіль
                  </button>
                  <Link href="/raffles" className={styles.actionButton}>
                    🎫 Переглянути розіграші
                  </Link>
                  {(user.canSell || user.role === "admin") && (
                    <Link href="/dashboard/raffles/new" className={styles.actionButton}>
                      ➕ Створити лот
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Детальна інформація */}
        {!isEditing && (
          <div className={styles.detailsSection}>
            <h2 className={styles.sectionTitle}>Інформація профілю</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>📧</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Email</div>
                  <div className={styles.detailValue}>{user.email}</div>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>👤</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Ім'я</div>
                  <div className={styles.detailValue}>{user.name || "Не вказано"}</div>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>🔐</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Роль</div>
                  <div className={styles.detailValue}>{getRoleLabel(user.role)}</div>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>💼</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Режим продавця</div>
                  <div className={styles.detailValue}>
                    {user.canSell ? "✅ Увімкнено" : "❌ Вимкнено"}
                  </div>
                </div>
              </div>

              {user.balance !== undefined && (
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>💰</div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Баланс</div>
                    <div className={styles.detailValue}>
                      {(user.balance || 0).toLocaleString("uk-UA")} ₴
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
