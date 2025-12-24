import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ action: string }>;
};

/**
 * Fallback сторінка для confirm actions, якщо intercepting route не спрацював
 * (наприклад, при прямому переході)
 */
export default async function ConfirmPage({ params }: Props) {
  const { action } = await params;
  
  // Якщо це не intercepting route, показуємо 404 або редіректимо
  // Наразі просто показуємо not-found
  notFound();
}

