import { Card, useTheme } from "@heroui/react";

export default function App() {
  const { resolvedTheme, setTheme } = useTheme("system");
  useEffect(() => {
    setTheme("system");
  }, [resolvedTheme]);
  return <Card>Hello</Card>;
}
