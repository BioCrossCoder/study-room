import { Card } from "@heroui/react";
import { triggerAutoSize } from "common";
import { useEffect } from "react";
import { useHeroUiTheme } from "ui";

export default function App() {
  useHeroUiTheme();
  useEffect(() => {
    triggerAutoSize(window.parent);
  });
  return <Card>Popup</Card>;
}
