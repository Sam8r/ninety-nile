import Link from "next/link";
import { listProjects } from "@/lib/actions/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} total</p>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="accent">
            <Plus className="size-4" />
            New
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-muted/30">
                <td className="p-3 font-medium">{project.titleEn}</td>
                <td className="p-3">
                  <Badge variant={project.status === "PUBLISHED" ? "accent" : "secondary"}>
                    {project.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
