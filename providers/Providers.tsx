"use client";

import { ReactQueryProvider } from "./ReactQueryProvider";
import { ToasterProvider } from "./ToasterProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ToasterProvider />
      {children}
    </ReactQueryProvider>
  );
}
