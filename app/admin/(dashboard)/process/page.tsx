import { listProcessSteps, upsertProcessStep, deleteProcessStep } from "@/lib/actions/structured-content";
import { BilingualCrudManager } from "@/components/admin/bilingual-crud-manager";

export const metadata = { title: "Process" };

export default async function ProcessAdminPage() {
  const items = await listProcessSteps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Creative Process</h1>
        <p className="text-sm text-muted-foreground">The steps shown on the Process page.</p>
      </div>
      <BilingualCrudManager
        items={items.map((s) => ({ id: s.id, labelEn: s.labelEn, labelAr: s.labelAr ?? "", descriptionEn: s.descriptionEn ?? "", descriptionAr: s.descriptionAr ?? "", order: s.order }))}
        fields={[
          { key: "labelEn", label: "Label (EN)", required: true },
          { key: "labelAr", label: "Label (AR)", ar: true },
          { key: "descriptionEn", label: "Description (EN)", textarea: true },
          { key: "descriptionAr", label: "Description (AR)", textarea: true, ar: true },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertProcessStep}
        remove={deleteProcessStep}
        defaultRow={{ labelEn: "", labelAr: "", descriptionEn: "", descriptionAr: "", order: items.length }}
      />
    </div>
  );
}
