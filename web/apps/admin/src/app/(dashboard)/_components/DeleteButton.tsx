"use client";

import type { ActionResult } from "@/actions/utils";
import { AlertDialog, Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteButton({
  id,
  name,
  resource = "item",
  onDelete,
}: {
  id: string;
  name: string;
  resource?: string;
  onDelete: (id: string) => Promise<ActionResult<unknown>>;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await onDelete(id);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setVisible(false);
      router.refresh();
    });
  };

  return (
    <AlertDialog isOpen={visible} onOpenChange={setVisible}>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        className="bg-danger-soft text-danger hover:bg-danger-soft-hover"
        aria-label={`Delete ${resource}`}
      >
        <Trash2 className="size-4" />
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete this {resource}?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete <strong>{name}</strong> and its
                related data. This action cannot be undone.
              </p>
              {error ? <p className="text-danger">{error}</p> : null}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button
                variant="danger"
                isDisabled={isPending}
                isPending={isPending}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
