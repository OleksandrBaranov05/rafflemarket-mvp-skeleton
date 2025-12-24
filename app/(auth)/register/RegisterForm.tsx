"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./RegisterForm.module.css";
import { register } from "@/lib/api/auth/register";
import { queryKeys } from "@/lib/utils/queryKeys";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/Loader/Loader";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";

type Values = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Schema = Yup.object({
  email: Yup.string().email("Некоректний email").required("Email обов'язковий"),
  password: Yup.string()
    .min(5, "Мінімум 5 символів")
    .required("Пароль обов'язковий")
    .matches(/[A-Za-z0-9]/, "Пароль має містити літери та цифри"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі не співпадають")
    .required("Підтвердження пароля обов'язкове"),
});

export function RegisterForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Values) => register({ email: values.email, password: values.password }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("Реєстрація успішна! Ви увійшли в систему");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Помилка реєстрації";
      toast.error(msg);
    },
  });

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validationSchema={Schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ handleSubmit, handleChange, values, errors, touched }) => (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {touched.email && errors.email && <span className={styles.error}>{errors.email}</span>}
          </label>

          <label className={styles.label}>
            Пароль
            <input
              className={styles.input}
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Мінімум 5 символів"
              autoComplete="new-password"
            />
            {touched.password && errors.password && <span className={styles.error}>{errors.password}</span>}
          </label>

          <label className={styles.label}>
            Підтвердження пароля
            <input
              className={styles.input}
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Введіть пароль ще раз"
              autoComplete="new-password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword}</span>
            )}
          </label>

          {mutation.isError && (
            <StatusBlock
              variant="error"
              title="Не вдалося зареєструватись"
              description={mutation.error instanceof Error ? mutation.error.message : "Спробуйте ще раз"}
            />
          )}

          <button className={styles.btn} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <span className={styles.btnRow}>
                <Loader size="sm" /> Реєстрація...
              </span>
            ) : (
              "Зареєструватись"
            )}
          </button>
        </form>
      )}
    </Formik>
  );
}

