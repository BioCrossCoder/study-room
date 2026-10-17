"use client";

import type { ActionResult } from "@/actions/utils";
import { url as urlSchema } from "@/models/api";
import type { WebMetadata } from "@/models/infra";
import { Button, Input, Label, Spinner, TextField, toast } from "@heroui/react";
import { Import } from "lucide-react";
import { useState } from "react";

type GetMetadata = (url: string) => Promise<ActionResult<WebMetadata>>;

export function UrlField({
  className,
  onImport,
  getMetadata,
}: {
  className?: string;
  onImport: (metadata: WebMetadata) => void;
  getMetadata: GetMetadata;
}) {
  const [url, setUrl] = useState("");
  const { importMetadata, isLoading } = useGetWebsiteMetadata(getMetadata);
  const canImport = urlSchema.safeParse(url).success;

  const handleImport = async () => {
    const metadata = await importMetadata(url);
    if (metadata) {
      onImport(metadata);
    }
  };

  return (
    <TextField
      name="url"
      type="url"
      isRequired
      value={url}
      onChange={setUrl}
      className={className}
    >
      <div className="flex items-center gap-1">
        <Label className="text-muted">URL</Label>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Import metadata from URL"
          isDisabled={!canImport || isLoading}
          onPress={handleImport}
        >
          {isLoading ? <Spinner size="sm" /> : <Import />}
        </Button>
      </div>
      <Input className="[--field-background:var(--surface-secondary)]" />
    </TextField>
  );
}

function useGetWebsiteMetadata(getMetadata: GetMetadata) {
  const [isLoading, setIsLoading] = useState(false);

  const importMetadata = async (url: string) => {
    setIsLoading(true);
    const result = await getMetadata(url);
    setIsLoading(false);
    if (!result.ok) {
      toast.danger("Failed to load website metadata", {
        description: result.error.message,
      });
      return null;
    }
    return result.data;
  };

  return { importMetadata, isLoading };
}
