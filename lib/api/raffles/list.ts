import { http } from "@/lib/utils/http";

export type ListRafflesParams = {
  q?: string;
  category?: string;
  status?: string;
  sort?: string;
  priceMin?: string;
  priceMax?: string;
  page?: number;
};

export type ListRafflesResponse = {
  raffles: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    sellerId: string;
    sellerEmail: string;
    totalTickets: number;
    ticketsSold: number;
    ticketPrice: number;
    status: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export function listRaffles(params: ListRafflesParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.category && params.category !== "all") searchParams.set("category", params.category);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.priceMin) searchParams.set("priceMin", params.priceMin);
  if (params.priceMax) searchParams.set("priceMax", params.priceMax);
  if (params.page) searchParams.set("page", params.page.toString());

  const queryString = searchParams.toString();
  return http<ListRafflesResponse>(`/api/raffles${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
}
