"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProfile } from "@/lib/api/profile/update";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader/Loader";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";
import { useState, useRef } from "react";
import styles from "./EditProfileModal.module.css";

type Values = {
  name: string;
  avatarFile: File | null;
};

const Schema = Yup.object({
  name: Yup.string().max(100, "Максимум 100 символів"),
});

type Props = {
  initialName?: string;
  initialAvatarUrl?: string;
  onClose: () => void;
};

export function EditProfileModal({ initialName, initialAvatarUrl, onClose }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl || null);

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      let avatarUrl = initialAvatarUrl;

      // Якщо вибрано файл, конвертуємо його в base64
      if (values.avatarFile) {
        avatarUrl = await fileToBase64(values.avatarFile);
      }

      return updateProfile({
        name: values.name || undefined,
        avatarUrl: avatarUrl || undefined,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("Профіль оновлено");
      router.refresh();
      onClose();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      // Створюємо preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Редагувати профіль</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрити">
            ×
          </button>
        </div>

        <Formik<Values>
          initialValues={{
            name: initialName || "",
            avatarFile: null,
          }}
          validationSchema={Schema}
          onSubmit={(values) => mutation.mutate(values)}
        >
          {({ setFieldValue, values, handleSubmit, errors, touched }) => {
            const avatarToShow = previewUrl || initialAvatarUrl || defaultAvatar;

            return (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarWrapper}>
                    <img
                      src={avatarToShow}
                      alt="Аватар"
                      className={styles.avatar}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue("avatarFile", file);
                        handleFileChange(e);
                      }
                    }}
                    className={styles.fileInput}
                    id="avatarFile"
                  />
                  <label htmlFor="avatarFile" className={styles.fileLabel}>
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

                {mutation.isError && (
                  <StatusBlock
                    variant="error"
                    title="Не вдалося оновити профіль"
                    description={mutation.error instanceof Error ? mutation.error.message : "Спробуйте ще раз"}
                  />
                )}

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={onClose}
                    disabled={mutation.isPending}
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className={styles.btnRow}>
                        <Loader size="sm" /> Збереження...
                      </span>
                    ) : (
                      "Зберегти зміни"
                    )}
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

