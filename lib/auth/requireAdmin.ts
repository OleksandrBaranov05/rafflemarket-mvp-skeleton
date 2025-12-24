import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}

