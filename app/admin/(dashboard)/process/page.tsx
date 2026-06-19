import { listProcessSteps, upsertProcessStep, deleteProcessStep } from "@/lib/actions/structured-content";
import { CrudManager } from "@/components/admin/crud-manager";

export const metadata = { title: "Process" };

export default async function ProcessAdminPage() {
  const items = await listProcessSteps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Creative Process</h1>
        <p className="text-sm text-muted-foreground">The steps shown on the Process page.</p>
      </div>
      <CrudManager
        items={items.map((s) => ({ id: s.id, labelEn: s.labelEn, descriptionEn: s.descriptionEn ?? "", order: s.order }))}
        fields={[
          { key: "labelEn", label: "Label", required: true },
          { key: "descriptionEn", label: "Description", textarea: true },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertProcessStep}
        remove={deleteProcessStep}
        defaultRow={{ labelEn: "", descriptionEn: "", order: items.length }}
      />
    </div>
  );
}
