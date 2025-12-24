"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./LoginForm.module.css";
import { login } from "@/lib/api/auth/login";
import { queryKeys } from "@/lib/utils/queryKeys";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/Loader/Loader";
import { StatusBlock } from "@/components/StatusBlock/StatusBlock";

type Values = {
  email: string;
  password: string;
};

const Schema = Yup.object({
  email: Yup.string().email("Некоректний email").required("Email обовʼязковий"),
  password: Yup.string().min(5, "Мінімум 5 символів").required("Пароль обовʼязковий"),
});

export function LoginForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Values) => login(values),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("Успішний вхід");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Помилка входу";
      toast.error(msg);
    },
  });

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "" }}
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {touched.password && errors.password && <span className={styles.error}>{errors.password}</span>}
          </label>

          {mutation.isError && (
            <StatusBlock
              variant="error"
              title="Не вдалося увійти"
              description={mutation.error instanceof Error ? mutation.error.message : "Спробуйте ще раз"}
            />
          )}

          <button className={styles.btn} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <span className={styles.btnRow}>
                <Loader size="sm" /> Вхід...
              </span>
            ) : (
              "Увійти"
            )}
          </button>

        </form>
      )}
    </Formik>
  );
}
