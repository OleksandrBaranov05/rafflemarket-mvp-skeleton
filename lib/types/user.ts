export type User = {
  id: string;
  email: string;
  passwordHash: string; // В MVP простіше, в продакшені bcrypt
  role: "user" | "seller" | "admin";
  name?: string;
  avatarUrl?: string;
  canSell?: boolean; // Можливість продавати (перемикач в профілі)
  balance?: number; // Баланс користувача в гривнях
  createdAt: string;
  updatedAt?: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
};

