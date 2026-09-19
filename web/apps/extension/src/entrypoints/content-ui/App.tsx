import { Card } from "@heroui/react";
import { triggerAutoSize } from "common";
import { useHeroUiTheme } from "ui";

export default function App() {
  useHeroUiTheme();
  useEffect(() => {
    triggerAutoSize(window.parent);
  }, []);
  return (
    <Card>
      <Card.Content>hello</Card.Content>
    </Card>
  );
}
