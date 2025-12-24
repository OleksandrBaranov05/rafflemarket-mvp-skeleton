import { Metadata } from "next";
import { requireSession } from "@/lib/auth/requireSession";
import { generatePageMetadata } from "@/lib/metadata/generatePageMetadata";
import { ProfilePage } from "./ProfilePage";

export const metadata: Metadata = generatePageMetadata({
  title: "Мій профіль",
  description: "Переглянути та редагувати профіль користувача",
});

export default async function ProfilePageServer() {
  const session = await requireSession();

  return (
    <ProfilePage
      user={{
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatarUrl: session.user.avatarUrl,
        role: session.user.role,
        canSell: session.user.canSell,
        balance: session.user.balance,
      }}
    />
  );
}

