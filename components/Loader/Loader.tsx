import styles from "./Loader.module.css";

export function Loader({ size = "md" }: { size?: "sm" | "md" }) {
  return <span className={`${styles.loader} ${styles[size]}`} aria-label="Loading" />;
}
