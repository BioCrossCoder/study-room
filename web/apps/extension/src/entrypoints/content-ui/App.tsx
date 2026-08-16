import { Card } from "@heroui/react";
import { WindowMessageType, useHeroUiTheme, createWindowMessage } from "common";

export default function App() {
  useHeroUiTheme();
  useEffect(() => {
    const { send } = createWindowMessage(
      window.parent,
      WindowMessageType.ContentResize,
    );
    const observer = new ResizeObserver(() => {
      send({
        height: document.body.scrollHeight,
        width: document.body.scrollWidth,
      });
    });
    observer.observe(document.documentElement);
  }, []);
  return (
    <Card>
      <Card.Content>hello</Card.Content>
    </Card>
  );
}
