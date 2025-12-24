import styles from "./StatusBlock.module.css";

export function StatusBlock({
  variant,
  title,
  description,
}: {
  variant: "error" | "info" | "success";
  title: string;
  description?: string;
}) {
  return (
    <div className={`${styles.block} ${styles[variant]}`}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.desc}>{description}</div>}
    </div>
  );
}
