import { Card } from "@heroui/react";

export default function App() {
  return (
    <ThemeProvider>
      <Card>
        <Card.Content className="text-default-foreground">hello</Card.Content>
      </Card>
    </ThemeProvider>
  );
}
