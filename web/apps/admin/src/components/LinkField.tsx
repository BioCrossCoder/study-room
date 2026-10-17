import { Link } from "@heroui/react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

export function LinkField({
  href,
  external,
  className,
  children,
}: PropsWithChildren<{
  href: string;
  external?: boolean;
  className?: string;
}>) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={[
        "flex w-full max-w-full min-w-0 items-center gap-1",
        className ?? "",
      ].join(" ")}
    >
      <Link.Icon className="size-4 shrink-0">
        {external ? (
          <ExternalLink className="size-full" />
        ) : (
          <LinkIcon className="size-full" />
        )}
      </Link.Icon>
      <span className="min-w-0 flex-1 wrap-break-word">{children}</span>
    </Link>
  );
}
