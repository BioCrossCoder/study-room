import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "ui/src/assets/style.css";

export const metadata: Metadata = {
  title: "Study Room",
  description: "Manage knowledge online on yourself",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
