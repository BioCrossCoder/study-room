"use client";

import type { ActionResult } from "@/actions/utils";
import { createLibrary } from "@/actions/library";
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
import { useActionState, useRef } from "react";
import type { SyntheticEvent } from "react";
import { ConfirmDialog } from "../../../_components/ConfirmDialog";

export function LibraryCreateForm() {
  const router = useRouter();
  const overlay = useOverlayState();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  const [, formAction, isPending] = useActionState(
    async (_prev: ActionResult<string[]> | null, form: FormData) => {
      const result = await createLibrary(null, form);
      if (result.ok) {
        overlay.close();
        router.push(`/library/${result.data[0]}`);
      } else {
        toast.danger("Failed to create library", {
          description: result.error.message,
        });
      }
      return result;
    },
    null,
  );

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
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <TextField name="name" isRequired>
                <Label className="text-muted text-sm">Name</Label>
                <Input className="truncate text-lg [--field-background:var(--surface-secondary)]" />
              </TextField>
              <TextField isDisabled>
                <Label className="text-muted text-sm">ID</Label>
                <Input className="font-mono text-xs" value="-" />
              </TextField>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <ConfirmDialog
                isOpen={overlay.isOpen}
                onOpenChange={overlay.setOpen}
                title="Create Library"
                isPending={isPending}
                onConfirm={handleConfirm}
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="primary"
                  type="submit"
                  aria-label="Create library"
                  aria-haspopup="dialog"
                >
                  <Save className="size-4" />
                </Button>
              </ConfirmDialog>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="bg-danger-soft text-danger hover:bg-danger-soft-hover"
                aria-label="Discard changes"
                onPress={() => router.push("/library")}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name="url" type="url" isRequired>
              <Label className="text-muted text-sm">URL</Label>
              <Input className="[--field-background:var(--surface-secondary)]" />
            </TextField>
            <TextField isDisabled>
              <Label className="text-muted text-sm">Created</Label>
              <Input value="-" />
            </TextField>
            <TextField isDisabled>
              <Label className="text-muted text-sm">Updated</Label>
              <Input value="-" />
            </TextField>
            <TextField name="description" isRequired className="sm:col-span-2">
              <Label className="text-muted text-sm">Description</Label>
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
