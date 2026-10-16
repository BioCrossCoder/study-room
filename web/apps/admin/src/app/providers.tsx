"use client";

import { RouterProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </ThemeProvider>
  );
}
