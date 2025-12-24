"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRaffle } from "@/lib/api/raffles/update";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader/Loader";
import type { Raffle } from "@/lib/types/raffle";
import styles from "./EditRaffleForm.module.css";

type Values = {
  title: string;
  description: string;
  imageUrl: string;
  totalTickets: number;
  ticketPrice: number;
  category: string;
  maxTicketsPerUser?: number;
};

const schema = Yup.object({
  title: Yup.string().required("Обов'язкове поле").min(3, "Мінімум 3 символи"),
  description: Yup.string().required("Обов'язкове поле").min(10, "Мінімум 10 символів"),
  imageUrl: Yup.string().url("Некоректний URL").required("Обов'язкове поле"),
  totalTickets: Yup.number()
    .required("Обов'язкове поле")
    .min(10, "Мінімум 10 квитків")
    .max(10000, "Максимум 10000 квитків")
    .integer("Має бути ціле число"),
  ticketPrice: Yup.number()
    .required("Обов'язкове поле")
    .min(1, "Мінімум 1 ₴")
    .max(100000, "Максимум 100000 ₴"),
  category: Yup.string().required("Обов'язкове поле"),
});

type Props = {
  initialRaffle: Raffle;
};

export function EditRaffleForm({ initialRaffle }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Partial<Values>) => updateRaffle(initialRaffle.id, values),
    onSuccess: (data) => {
      toast.success("Лот оновлено!");
      qc.invalidateQueries({ queryKey: queryKeys.raffles.detail(initialRaffle.id) });
      qc.invalidateQueries({ queryKey: queryKeys.raffles.list() });
      router.push(`/raffles/${initialRaffle.id}`);
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Помилка при оновленні лоту");
    },
  });

  const initialValues: Values = {
    title: initialRaffle.title,
    description: initialRaffle.description,
    imageUrl: initialRaffle.imageUrl,
    totalTickets: initialRaffle.totalTickets,
    ticketPrice: initialRaffle.ticketPrice,
    category: initialRaffle.category || "",
    maxTicketsPerUser: initialRaffle.maxTicketsPerUser,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={(values) => mutation.mutate(values)}>
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Назва товару *
            </label>
            <Field id="title" name="title" type="text" className={styles.input} placeholder="Наприклад: BMW X5 2023" />
            <ErrorMessage name="title" component="div" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Опис *
            </label>
            <Field
              id="description"
              name="description"
              as="textarea"
              rows={6}
              className={styles.textarea}
              placeholder="Детальний опис товару..."
            />
            <ErrorMessage name="description" component="div" className={styles.error} />
          </div>

          <div className={styles.field}>
            <label htmlFor="imageUrl" className={styles.label}>
              URL зображення *
            </label>
            <Field
              id="imageUrl"
              name="imageUrl"
              type="url"
              className={styles.input}
              placeholder="https://example.com/image.jpg"
            />
            <ErrorMessage name="imageUrl" component="div" className={styles.error} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="totalTickets" className={styles.label}>
                Загальна кількість квитків *
              </label>
              <Field
                id="totalTickets"
                name="totalTickets"
                type="number"
                className={styles.input}
                min="10"
                max="10000"
              />
              <ErrorMessage name="totalTickets" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label htmlFor="ticketPrice" className={styles.label}>
                Ціна квитка (₴) *
              </label>
              <Field
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                className={styles.input}
                min="1"
                max="100000"
              />
              <ErrorMessage name="ticketPrice" component="div" className={styles.error} />
            </div>

            <div className={styles.field}>
              <label htmlFor="category" className={styles.label}>
                Категорія *
              </label>
              <Field id="category" name="category" as="select" className={styles.select}>
                <option value="">Оберіть категорію</option>
                <option value="Автомобілі">Автомобілі</option>
                <option value="Нерухомість">Нерухомість</option>
                <option value="Техніка">Техніка</option>
                <option value="Коштовності">Коштовності</option>
                <option value="Інше">Інше</option>
              </Field>
              <ErrorMessage name="category" component="div" className={styles.error} />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="maxTicketsPerUser" className={styles.label}>
              Максимум квитків на користувача (опціонально)
            </label>
            <Field
              id="maxTicketsPerUser"
              name="maxTicketsPerUser"
              type="number"
              className={styles.input}
              min="1"
            />
            <p className={styles.hint}>Залиште порожнім, якщо обмеження немає</p>
            <ErrorMessage name="maxTicketsPerUser" component="div" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Відмінити
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader size="sm" /> Збереження...
                </>
              ) : (
                "💾 Зберегти зміни"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

