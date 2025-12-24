"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  action: string;
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Компонент для переходу до сторінки підтвердження через intercepting route
 */
export function ConfirmLink({ action, href, className, children }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/confirm/${action}`);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

