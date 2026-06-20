import Link from "next/link";
import Image from "next/image";
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
import { ui } from "@/lib/content/ui";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const metadata = {
  title: { default: "Dashboard | NinetyNile", template: "%s | NinetyNile Dashboard" },
};

type NavEntry = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const NAV: ReadonlyArray<NavEntry> = [
  { href: "/admin", label: ui.admin.navOverview, icon: LayoutDashboard },
  { href: "/admin/case-studies", label: ui.admin.navCaseStudies, icon: Film },
  { href: "/admin/projects", label: ui.admin.navProjects, icon: FolderKanban },
  { href: "/admin/media", label: ui.admin.navMedia, icon: ImageIcon },
  { href: "/admin/services", label: ui.admin.navServices, icon: Sparkles },
  { href: "/admin/process", label: ui.admin.navProcess, icon: Workflow },
  { href: "/admin/tribe", label: ui.admin.navTribe, icon: Users },
  { href: "/admin/clients", label: ui.admin.navClients, icon: Building2 },
  { href: "/admin/testimonials", label: ui.admin.navTestimonials, icon: Quote },
  { href: "/admin/branding", label: ui.admin.navBranding, icon: Palette, adminOnly: true },
  { href: "/admin/content", label: ui.admin.navContent, icon: FileText, adminOnly: true },
  { href: "/admin/contact", label: ui.admin.navContact, icon: Mail, adminOnly: true },
  { href: "/admin/users", label: ui.admin.navUsers, icon: UserCog, adminOnly: true },
];

function AdminLogo() {
  return (
    <Link href="/admin" className="flex items-center gap-1.5">
      <Image
        src="/brand/ninetynile-black.png"
        alt="NinetyNile"
        width={90}
        height={36}
        className="h-7 w-auto object-contain"
      />
      <span className="text-muted-foreground/40">|</span>
      <Image
        src="/brand/mastaba-black.png"
        alt="Mastaba"
        width={36}
        height={15}
        className="h-4 w-auto object-contain"
      />
    </Link>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession("/admin");

  return (
    <div className="min-h-dvh bg-muted/30">
      <div className="flex">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e bg-card lg:flex">
          <div className="flex h-16 items-center border-b px-6">
            <AdminLogo />
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
                  {entry.label}
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
            <SignOutButton label={ui.admin.signOut} />
          </div>
        </aside>

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur lg:hidden">
            <AdminLogo />
            <SignOutButton label={ui.admin.signOut} compact />
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
