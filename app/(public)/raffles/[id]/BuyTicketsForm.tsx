"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buyTickets } from "@/lib/api/tickets/buy";
import { queryKeys } from "@/lib/utils/queryKeys";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Raffle } from "@/lib/types/raffle";
import { Loader } from "@/components/Loader/Loader";
import styles from "./BuyTicketsForm.module.css";

type Props = {
  raffle: Raffle;
  ticketsAvailable: number;
  userTicketsCount?: number;
};

type Values = {
  quantity: number;
};

const schema = Yup.object({
  quantity: Yup.number()
    .required("Обов'язкове поле")
    .min(1, "Мінімум 1 квиток")
    .integer("Має бути ціле число"),
});

export function BuyTicketsForm({ raffle, ticketsAvailable, userTicketsCount = 0 }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const buyMutation = useMutation({
    mutationFn: buyTickets,
    onSuccess: (data) => {
      toast.success(`Успішно придбано ${data.tickets.length} квитків!`);
      qc.invalidateQueries({ queryKey: queryKeys.raffles.detail(raffle.id) });
      qc.invalidateQueries({ queryKey: queryKeys.raffles.list() });
      router.push("/confirm/payment");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Помилка при купівлі квитків");
    },
  });

  const initialValues: Values = {
    quantity: 1,
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Купити квитки</h3>
      <p className={styles.available}>Доступно квитків: {ticketsAvailable}</p>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          if (values.quantity > ticketsAvailable) {
            toast.error("Недостатньо доступних квитків");
            setSubmitting(false);
            return;
          }

          buyMutation.mutate(
            { raffleId: raffle.id, quantity: values.quantity },
            { onSettled: () => setSubmitting(false) }
          );
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          const maxTicketsPerUser = raffle.maxTicketsPerUser;
          const userTicketsLeft = maxTicketsPerUser ? maxTicketsPerUser - userTicketsCount : ticketsAvailable;
          const maxToBuy = Math.min(ticketsAvailable, maxTicketsPerUser ? userTicketsLeft : ticketsAvailable);
          const totalPrice = values.quantity * raffle.ticketPrice;

          return (
            <Form className={styles.form}>
              {maxTicketsPerUser && userTicketsCount > 0 && (
                <div className={styles.limitNotice}>
                  Ви вже маєте {userTicketsCount} з {maxTicketsPerUser} дозволених квитків. Можна купити ще: {userTicketsLeft}
                </div>
              )}
              <div className={styles.field}>
                <label htmlFor="quantity" className={styles.label}>
                  Кількість квитків
                </label>
                <div className={styles.quantityControls}>
                  <button
                    type="button"
                    className={styles.quantityBtn}
                    onClick={() => {
                      if (values.quantity > 1) {
                        setFieldValue("quantity", values.quantity - 1);
                      }
                    }}
                    disabled={values.quantity <= 1}
                  >
                    −
                  </button>
                  <Field
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={maxToBuy}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.quantityBtn}
                    onClick={() => {
                      if (values.quantity < maxToBuy) {
                        setFieldValue("quantity", values.quantity + 1);
                      }
                    }}
                    disabled={values.quantity >= maxToBuy}
                  >
                    +
                  </button>
                </div>
                <ErrorMessage name="quantity" component="div" className={styles.error} />
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Ціна за квиток:</span>
                  <span>{raffle.ticketPrice} ₴</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Кількість:</span>
                  <span>{values.quantity}</span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span>До сплати:</span>
                  <span className={styles.total}>{totalPrice} ₴</span>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || buyMutation.isPending || ticketsAvailable === 0}
              >
                {isSubmitting || buyMutation.isPending ? (
                  <>
                    <Loader size="sm" /> Обробка...
                  </>
                ) : (
                  "Купити квитки"
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

