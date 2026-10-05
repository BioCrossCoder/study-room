import { Card } from "@heroui/react";
import { use } from "react";

export default function LibraryDetailPage({
  params,
}: PageProps<"/library/[id]">) {
  const { id } = use(params);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Library Detail</Card.Title>
        <Card.Description>Placeholder for library item {id}.</Card.Description>
      </Card.Header>
    </Card>
  );
}
