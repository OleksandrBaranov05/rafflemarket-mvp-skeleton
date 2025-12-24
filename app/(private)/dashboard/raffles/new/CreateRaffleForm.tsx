"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRaffle } from "@/lib/api/raffles/create";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader/Loader";
import styles from "./CreateRaffleForm.module.css";

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

export function CreateRaffleForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRaffle,
    onSuccess: (data) => {
      toast.success("Розіграш створено! Очікуйте модерації.");
      qc.invalidateQueries({ queryKey: queryKeys.raffles.list() });
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Помилка при створенні розіграшу");
    },
  });

  const initialValues: Values = {
    title: "",
    description: "",
    imageUrl: "",
    totalTickets: 100,
    ticketPrice: 100,
    category: "",
    maxTicketsPerUser: undefined,
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

            <div className={styles.field}>
              <label htmlFor="totalTickets" className={styles.label}>
                Всього квитків *
              </label>
              <Field
                id="totalTickets"
                name="totalTickets"
                type="number"
                min="10"
                max="10000"
                className={styles.input}
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
                min="1"
                max="100000"
                className={styles.input}
              />
              <ErrorMessage name="ticketPrice" component="div" className={styles.error} />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="maxTicketsPerUser" className={styles.label}>
              Макс. квитків на користувача (опціонально)
            </label>
            <Field
              id="maxTicketsPerUser"
              name="maxTicketsPerUser"
              type="number"
              min="1"
              className={styles.input}
              placeholder="Без обмежень"
            />
            <p className={styles.hint}>Залиште порожнім, щоб не обмежувати кількість квитків на одного користувача</p>
            <ErrorMessage name="maxTicketsPerUser" component="div" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => router.back()} disabled={isSubmitting}>
              Скасувати
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? (
                <>
                  <Loader size="sm" /> Створення...
                </>
              ) : (
                "Створити розіграш"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

