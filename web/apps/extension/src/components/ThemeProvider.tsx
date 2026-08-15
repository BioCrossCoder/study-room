import { useTheme } from "@heroui/react";
import type { PropsWithChildren } from "react";

export default function ThemeProvider(props: PropsWithChildren) {
  const { resolvedTheme, setTheme } = useTheme("system");
  useEffect(() => {
    setTheme("system");
  }, [resolvedTheme]);
  return <div className={resolvedTheme}>{props.children}</div>;
}
