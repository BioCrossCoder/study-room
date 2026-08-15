import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider(props: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {props.children}
    </NextThemeProvider>
  );
}
