"use client";

import type { ActionResult } from "@/actions/utils";
import { createLibrary, getLibraryMetadata } from "@/actions/library";
import type { WebMetadata } from "@/models/infra";
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
import {
  useEffect,
  useEffectEvent,
  useActionState,
  useRef,
  useState,
} from "react";
import type { SyntheticEvent } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DiscardButton } from "@/components/DiscardButton";
import { UrlField } from "../../../components/UrlField";

export function LibraryCreateForm() {
  const router = useRouter();
  const overlay = useOverlayState();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  const handleImport = (metadata: WebMetadata) => {
    if (metadata.title) {
      setName(metadata.title);
    }
    if (metadata.description) {
      setDescription(metadata.description);
    }
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
              <TextField name="name" isRequired value={name} onChange={setName}>
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
            <UrlField
              className="@2xl:col-span-2"
              onImport={handleImport}
              getMetadata={getLibraryMetadata}
            />
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
              value={description}
              onChange={setDescription}
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
