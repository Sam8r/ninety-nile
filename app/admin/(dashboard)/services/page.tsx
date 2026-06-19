import { listServices, upsertService, deleteService } from "@/lib/actions/structured-content";
import { BilingualCrudManager } from "@/components/admin/bilingual-crud-manager";

export const metadata = { title: "Services" };

export default async function ServicesAdminPage() {
  const items = await listServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Services</h1>
        <p className="text-sm text-muted-foreground">Manage the services listed on the public site.</p>
      </div>
      <BilingualCrudManager
        items={items.map((s) => ({ id: s.id, nameEn: s.nameEn, nameAr: s.nameAr ?? "", descriptionEn: s.descriptionEn ?? "", descriptionAr: s.descriptionAr ?? "", order: s.order }))}
        fields={[
          { key: "nameEn", label: "Name (EN)", required: true },
          { key: "nameAr", label: "Name (AR)", ar: true },
          { key: "descriptionEn", label: "Description (EN)", textarea: true },
          { key: "descriptionAr", label: "Description (AR)", textarea: true, ar: true },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertService}
        remove={deleteService}
        defaultRow={{ nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "", order: items.length }}
      />
    </div>
  );
}
