import { requireSession } from "@/lib/auth/requireSession";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await requireSession(); // redirect if no session
  return <>{children}</>;
}
