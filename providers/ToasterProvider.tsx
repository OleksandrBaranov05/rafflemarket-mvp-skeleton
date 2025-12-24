"use client";

import { Toaster } from "react-hot-toast";
import styles from "./providers.module.css";

export function ToasterProvider() {
  return (
    <div className={styles.toaster}>
      <Toaster position="top-right" />
    </div>
  );
}
