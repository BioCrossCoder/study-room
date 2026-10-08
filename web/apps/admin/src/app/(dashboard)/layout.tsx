"use client";

import { Breadcrumbs, Button, Label, ListBox, Toast } from "@heroui/react";
import {
  Bookmark,
  Files,
  Library,
  MessageSquareText,
  NotebookText,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import { COMPACT_MEDIA, getMediaQuery } from "@/common/media";
import { usePathSegments } from "@/hooks/usePathSegments";
import { UserInfo } from "@/app/(dashboard)/_components/UserInfo";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const ROUTES: readonly NavItem[] = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/resource", label: "Resource", icon: Files },
  { href: "/bookmark", label: "Bookmark", icon: Bookmark },
  { href: "/annotation", label: "Annotation", icon: MessageSquareText },
  { href: "/summary", label: "Summary", icon: NotebookText },
];

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  const router = useRouter();
  const segments = usePathSegments();
  const [expanded, setExpanded] = useState(true);
  const [floating, setFloating] = useState(false);
  const subscribeCompact = useCallback((onStoreChange: () => void) => {
    const media = getMediaQuery(COMPACT_MEDIA);
    const handleChange = () => {
      if (!media.matches) {
        setFloating(false);
      }
      onStoreChange();
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);
  const isCompact = useSyncExternalStore(
    subscribeCompact,
    () => getMediaQuery(COMPACT_MEDIA).matches,
    () => true,
  );

  const activeHref = `/${segments[0]}`;
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const route = ROUTES.find((item) => item.href === href);
    return { href, label: route?.label ?? segment };
  });

  const opened = isCompact ? floating : expanded;

  const toggle = () => {
    if (isCompact) {
      setFloating((prev) => !prev);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const navigate = (href: string) => {
    router.push(href);
    if (isCompact) {
      setFloating(false);
    }
  };

  return (
    <div className="h-dvh flex overflow-hidden">
      <Toast.Provider placement="bottom" />
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        inert={opened ? undefined : true}
        className={[
          "border-separator bg-surface flex shrink-0 flex-col border-r px-2",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:shadow-lg max-md:p-2!",
          "transition-[width] duration-200 max-md:transition-transform",
          expanded ? "w-64" : "w-0 overflow-hidden border-r-0! p-0!",
          floating ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        ].join(" ")}
      >
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
                  onClick={() => navigate(item.href)}
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
      <div className="relative min-w-0 flex flex-1 flex-col">
        <header className="border-separator bg-surface relative z-30 flex h-14 items-center gap-1 border-b px-3">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="shrink-0"
            aria-label={opened ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={opened}
            aria-controls="dashboard-sidebar"
            onPress={toggle}
          >
            <PanelLeft className="size-4" />
          </Button>
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
        {!isCompact || !floating ? null : (
          <div
            aria-hidden="true"
            className="bg-backdrop absolute inset-x-0 top-14 bottom-0 z-20 cursor-default"
            onClick={() => setFloating(false)}
          />
        )}
        <main className="bg-background flex-1 overflow-y-auto p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
