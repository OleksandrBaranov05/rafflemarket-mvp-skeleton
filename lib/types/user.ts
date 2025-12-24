export type User = {
  id: string;
  email: string;
  passwordHash: string; // В MVP простіше, в продакшені bcrypt
  role: "user" | "seller" | "admin";
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
};

