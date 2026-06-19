import { notFound } from "next/navigation";
import { getProject } from "@/lib/actions/projects";
import { deleteProject } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/admin/project-form";
import { DeleteButton } from "@/components/admin/delete-button";
import type { ProjectInput } from "@/lib/validation/project";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">New Project</h1>
        <ProjectForm />
      </div>
    );
  }

  const project = await getProject(id);
  if (!project) notFound();

  const initial: Partial<ProjectInput> = {
    slug: project.slug,
    titleEn: project.titleEn,
    titleAr: project.titleAr ?? "",
    descriptionEn: project.descriptionEn ?? "",
    descriptionAr: project.descriptionAr ?? "",
    externalLinks: (project.externalLinks as ProjectInput["externalLinks"]) ?? [],
    heroMediaId: project.heroMediaId ?? "",
    order: project.order,
    status: project.status,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{project.titleEn}</h1>
        <DeleteButton action={() => deleteProject(project.id)} redirectTo="/admin/projects" />
      </div>
      <ProjectForm id={project.id} initial={initial} />
    </div>
  );
}
