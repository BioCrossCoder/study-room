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
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useActionState, useRef } from "react";
import type { SyntheticEvent } from "react";
import { ConfirmDialog } from "../../../_components/ConfirmDialog";
import { DiscardButton } from "../../../_components/DiscardButton";

export function LibraryCreateForm() {
  const router = useRouter();
  const overlay = useOverlayState();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  const [state, formAction, isPending] = useActionState(createLibrary, null);

  const handleSettled = useEffectEvent((result: ActionResult<string[]>) => {
    if (!result.ok) {
      toast.danger("Failed to create library", {
        description: result.error.message,
      });
      return;
    }
    overlay.close();
    router.push(`/library/${result.data[0]}`);
  });

  useEffect(() => {
    if (state) {
      handleSettled(state);
    }
  }, [state]);

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
              <TextField name="name" isRequired>
                <Label className="text-muted">Name</Label>
                <Input className="truncate text-lg [--field-background:var(--surface-secondary)]" />
              </TextField>
              <TextField isDisabled>
                <Label className="text-muted">ID</Label>
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
                  <Save />
                </Button>
              </ConfirmDialog>
              <DiscardButton onDiscard={router.back} />
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-3 @2xl:grid-cols-2 @7xl:grid-cols-4">
            <TextField
              name="url"
              type="url"
              isRequired
              className="@2xl:col-span-2"
            >
              <Label className="text-muted">URL</Label>
              <Input className="[--field-background:var(--surface-secondary)]" />
            </TextField>
            <div className="grid grid-cols-2 gap-3 @2xl:col-span-2">
              <TextField isDisabled>
                <Label className="text-muted">Created</Label>
                <Input value="-" />
              </TextField>
              <TextField isDisabled>
                <Label className="text-muted">Updated</Label>
                <Input value="-" />
              </TextField>
            </div>
            <TextField
              name="description"
              isRequired
              className="@2xl:col-span-2 @7xl:col-span-4"
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
