"use client";

import { Breadcrumbs, Label, ListBox } from "@heroui/react";
import {
  Bookmark,
  FileText,
  Folder,
  Library,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathSegments } from "@/hooks/usePathSegments";
import { UserInfo } from "@/app/(dashboard)/_components/UserInfo";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const ROUTES: readonly NavItem[] = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/resource", label: "Resource", icon: Folder },
  { href: "/bookmark", label: "Bookmark", icon: Bookmark },
  { href: "/annotation", label: "Annotation", icon: MessageSquareText },
  { href: "/summary", label: "Summary", icon: FileText },
];

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  const router = useRouter();
  const segments = usePathSegments();
  const activeHref = `/${segments[0]}`;
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const route = ROUTES.find((item) => item.href === href);
    return { href, label: route?.label ?? segment };
  });

  return (
    <div className="h-dvh flex overflow-hidden">
      <aside className="border-separator bg-surface w-64 flex shrink-0 flex-col border-r px-2">
        <UserInfo />
        <nav className="flex-1 overflow-y-auto">
          <ListBox
            aria-label="Dashboard navigation"
            selectionMode="single"
            selectedKeys={activeHref ? [activeHref] : []}
          >
            {ROUTES.map((item) => {
              const Icon = item.icon;
              return (
                <ListBox.Item
                  key={item.href}
                  id={item.href}
                  textValue={item.label}
                  className="data-[selected=true]:bg-accent-soft group"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="text-muted group-data-[selected=true]:text-accent size-4 shrink-0" />
                  <Label className="group-data-[selected=true]:text-accent-soft-foreground">
                    {item.label}
                  </Label>
                </ListBox.Item>
              );
            })}
          </ListBox>
        </nav>
      </aside>
      <div className="min-w-0 flex flex-1 flex-col">
        <header className="border-separator bg-surface h-14 flex items-center border-b px-3">
          <Breadcrumbs>
            {crumbs.map((crumb, index) => (
              <Breadcrumbs.Item
                key={crumb.href}
                href={index === crumbs.length - 1 ? undefined : crumb.href}
              >
                {crumb.label}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        </header>
        <main className="bg-background flex-1 overflow-y-auto p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
