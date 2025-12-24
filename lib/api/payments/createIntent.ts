import { http } from "@/lib/utils/http";

export type CreatePaymentIntentInput = {
  raffleId: string;
  quantity: number;
};

export type CreatePaymentIntentResponse = {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
};

export function createPaymentIntent(input: CreatePaymentIntentInput) {
  return http<CreatePaymentIntentResponse>("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

