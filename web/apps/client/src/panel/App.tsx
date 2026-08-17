import { Card } from "@heroui/react";
import { triggerAutoSize, useHeroUiTheme } from "common";
import { useEffect } from "react";

export default function App() {
  useHeroUiTheme();
  useEffect(() => {
    triggerAutoSize(window.parent);
  });
  return <Card>Panel</Card>;
}
