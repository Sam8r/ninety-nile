import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  LayoutDashboard,
  Film,
  FolderKanban,
  ImageIcon,
  Sparkles,
  Workflow,
  Users,
  Building2,
  Quote,
  Palette,
  FileText,
  Mail,
  UserCog,
} from "lucide-react";
import { requireSession } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const metadata = {
  title: { default: "Dashboard | NinetyNile", template: "%s | NinetyNile Dashboard" },
};

type NavEntry = {
  href: string;
  labelKey: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const NAV: ReadonlyArray<NavEntry> = [
  { href: "/admin", labelKey: "navOverview", icon: LayoutDashboard },
  { href: "/admin/case-studies", labelKey: "navCaseStudies", icon: Film },
  { href: "/admin/projects", labelKey: "navProjects", icon: FolderKanban },
  { href: "/admin/media", labelKey: "navMedia", icon: ImageIcon },
  { href: "/admin/services", labelKey: "navServices", icon: Sparkles },
  { href: "/admin/process", labelKey: "navProcess", icon: Workflow },
  { href: "/admin/tribe", labelKey: "navTribe", icon: Users },
  { href: "/admin/clients", labelKey: "navClients", icon: Building2 },
  { href: "/admin/testimonials", labelKey: "navTestimonials", icon: Quote },
  { href: "/admin/branding", labelKey: "navBranding", icon: Palette, adminOnly: true },
  { href: "/admin/content", labelKey: "navContent", icon: FileText, adminOnly: true },
  { href: "/admin/contact", labelKey: "navContact", icon: Mail, adminOnly: true },
  { href: "/admin/users", labelKey: "navUsers", icon: UserCog, adminOnly: true },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession("/admin");
  const t = await getTranslations("Admin");

  return (
    <div className="min-h-dvh bg-muted/30">
      <div className="flex">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e bg-card lg:flex">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="font-heading text-lg font-bold">
              NinetyNile
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV.filter((entry) => !entry.adminOnly || user.role === "ADMIN").map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {t(entry.labelKey)}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-3">
            <div className="mb-2 px-3 text-xs text-muted-foreground">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate">{user.email}</p>
              <p className="mt-0.5 inline-block rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                {user.role}
              </p>
            </div>
            <SignOutButton label={t("signOut")} />
          </div>
        </aside>

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur lg:hidden">
            <Link href="/admin" className="font-heading text-base font-bold">
              NinetyNile
            </Link>
            <SignOutButton label={t("signOut")} compact />
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
