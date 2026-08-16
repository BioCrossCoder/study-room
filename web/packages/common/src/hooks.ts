import { useTheme } from "@heroui/react";
import { useEffect } from "react";

export function useHeroUiTheme() {
  const { resolvedTheme, setTheme } = useTheme("system");
  useEffect(() => {
    setTheme("system");
  }, [resolvedTheme]);
}
