import Link from "next/link";
import { listCaseStudies } from "@/lib/actions/case-studies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReorderList } from "@/components/admin/reorder-list";
import { Plus } from "lucide-react";

export const metadata = { title: "Case Studies" };

export default async function CaseStudiesPage() {
  const studies = await listCaseStudies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Case Studies</h1>
          <p className="text-sm text-muted-foreground">{studies.length} total</p>
        </div>
        <Link href="/admin/case-studies/new">
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
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {studies.map((study) => (
              <tr key={study.id} className="hover:bg-muted/30">
                <td className="p-3 font-medium">{study.titleEn}</td>
                <td className="p-3 text-muted-foreground">
                  {study.category.replace(/_/g, " ").toLowerCase()}
                </td>
                <td className="p-3">
                  <Badge variant={study.status === "PUBLISHED" ? "accent" : "secondary"}>
                    {study.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/case-studies/${study.id}`}
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

      <div className="space-y-2">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Reorder
        </h2>
        <ReorderList
          initialItems={studies.map((s) => ({ id: s.id, titleEn: s.titleEn, order: s.order }))}
        />
      </div>
    </div>
  );
}
