"use client";

import { Button, toast } from "@heroui/react";
import { Copy } from "lucide-react";
import { ResultAsync } from "neverthrow";
import { wrapError } from "common";
import { ClippedText } from "./ClippedText";

export function CopyableText({ children }: { children: string }) {
  const copy = async () => {
    const result = await ResultAsync.fromPromise(
      navigator.clipboard
        ? navigator.clipboard.writeText(children)
        : Promise.reject(new Error("Clipboard is unavailable")),
      wrapError,
    );
    if (result.isErr()) {
      toast.danger("Failed to copy", { description: result.error.message });
      return;
    }
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Button
        isIconOnly
        variant="ghost"
        className="text-muted hover:text-foreground size-4 shrink-0 p-0 [&_svg]:m-0"
        aria-label="Copy to clipboard"
        onPress={copy}
      >
        <Copy className="size-full" />
      </Button>
      <div className="min-w-0 flex-1">
        <ClippedText>{children}</ClippedText>
      </div>
    </div>
  );
}
