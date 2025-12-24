import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/Header/Header";
import { defaultMetadata } from "@/lib/metadata/defaultMetadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={styles.body}>
        <Providers>
          <Header />
          <main className={styles.main}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
