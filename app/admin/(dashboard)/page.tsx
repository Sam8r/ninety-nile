import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, FolderKanban, Mail, ImageIcon } from "lucide-react";

export default async function AdminOverview() {
  const user = await requireSession("/admin");

  const [caseStudies, projects, submissions, media] = await Promise.all([
    prisma.caseStudy.count(),
    prisma.project.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.mediaAsset.count(),
  ]);

  const stats = [
    { label: "Case Studies", value: caseStudies, icon: Film, href: "/admin/case-studies" },
    { label: "Projects", value: projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "New Messages", value: submissions, icon: Mail, href: "/admin/contact" },
    { label: "Media Assets", value: media, icon: ImageIcon, href: "/admin/media" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Welcome, {user.name}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s a snapshot of your content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-heading text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
