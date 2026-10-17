"use client";

import { AlertDialog, Button } from "@heroui/react";
import type { PropsWithChildren } from "react";

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  children,
  title,
  isPending,
  onConfirm,
}: PropsWithChildren<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  isPending: boolean;
  onConfirm: () => void;
}>) {
  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="warning" />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={isPending}
                isPending={isPending}
                onPress={onConfirm}
              >
                Confirm
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
