"use client";

import { Avatar, Label } from "@heroui/react";

export function UserInfo() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar color="accent">
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <Label className="truncate">Username</Label>
        <span className="truncate text-xs text-muted">user@example.com</span>
      </div>
    </div>
  );
}
