import { requireSession } from "@/lib/auth/requireSession";
import { ProfileView } from "./ProfileView";
import styles from "./profile.module.css";

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <div className={styles.wrap}>
      <ProfileView
        user={{
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          avatarUrl: session.user.avatarUrl,
          role: session.user.role,
        }}
      />
    </div>
  );
}

