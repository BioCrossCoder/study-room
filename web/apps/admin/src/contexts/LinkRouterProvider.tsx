"use client";

import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

export function LinkRouterProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
