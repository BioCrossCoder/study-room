"use client";

import type { library } from "@/models/orm";
import type { ActionResult } from "@/actions/utils";
import { updateLibrary } from "@/actions/library";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { formatDateTime } from "common";
import { useTimeZone } from "@/hooks/useTimeZone";
import { ConfirmDialog } from "../../../../_components/ConfirmDialog";

export function LibraryForm({
  item,
  onDiscard,
  onSaved,
}: {
  item: typeof library.$inferSelect;
  onDiscard: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const timeZone = useTimeZone();
  const overlay = useOverlayState();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);
  const [values, setValues] = useState({
    name: item.name,
    description: item.description,
  });

  const [, formAction, isPending] = useActionState(
    async (_prev: ActionResult<null> | null, form: FormData) => {
      form.set("id", item.id);
      const result = await updateLibrary(null, form);
      if (result.ok) {
        overlay.close();
        onSaved();
        router.refresh();
      } else {
        toast.danger("Failed to save changes", {
          description: result.error.message,
        });
      }
      return result;
    },
    null,
  );

  const handleDiscard = () => {
    overlay.close();
    onDiscard();
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return;
    }
    event.preventDefault();
    overlay.open();
  };

  const handleConfirm = () => {
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  };

  return (
    <Card>
      <Form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <Card.Header>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <TextField
                name="name"
                isRequired
                value={values.name}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, name: value }))
                }
              >
                <Label className="text-muted">Name</Label>
                <Input className="truncate text-lg [--field-background:var(--surface-secondary)]" />
              </TextField>
              <TextField isDisabled>
                <Label className="text-muted">ID</Label>
                <Input className="font-mono text-xs" value={item.id} />
              </TextField>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <ConfirmDialog
                isOpen={overlay.isOpen}
                onOpenChange={overlay.setOpen}
                title="Save Changes"
                isPending={isPending}
                onConfirm={handleConfirm}
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="primary"
                  type="submit"
                  aria-label="Save changes"
                  aria-haspopup="dialog"
                >
                  <Save />
                </Button>
              </ConfirmDialog>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="bg-danger-soft text-danger hover:bg-danger-soft-hover"
                aria-label="Discard changes"
                onPress={handleDiscard}
              >
                <X />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField isDisabled>
              <Label className="text-muted">URL</Label>
              <Input value={item.url} />
            </TextField>
            <TextField isDisabled>
              <Label className="text-muted">Created</Label>
              <Input value={formatDateTime(item.createAt, timeZone)} />
            </TextField>
            <TextField isDisabled>
              <Label className="text-muted">Updated</Label>
              <Input value={formatDateTime(item.updateAt, timeZone)} />
            </TextField>
            <TextField
              name="description"
              isRequired
              className="sm:col-span-2"
              value={values.description}
              onChange={(value) =>
                setValues((prev) => ({ ...prev, description: value }))
              }
            >
              <Label className="text-muted">Description</Label>
              <TextArea
                rows={4}
                className="[--field-background:var(--surface-secondary)]"
              />
            </TextField>
          </div>
        </Card.Content>
      </Form>
    </Card>
  );
}
