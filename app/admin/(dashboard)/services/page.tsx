import { listServices, upsertService, deleteService } from "@/lib/actions/structured-content";
import { CrudManager } from "@/components/admin/crud-manager";

export const metadata = { title: "Services" };

export default async function ServicesAdminPage() {
  const items = await listServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Services</h1>
        <p className="text-sm text-muted-foreground">Manage the services listed on the public site.</p>
      </div>
      <CrudManager
        items={items.map((s) => ({ id: s.id, nameEn: s.nameEn, descriptionEn: s.descriptionEn ?? "", order: s.order }))}
        fields={[
          { key: "nameEn", label: "Name", required: true },
          { key: "descriptionEn", label: "Description", textarea: true },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertService}
        remove={deleteService}
        defaultRow={{ nameEn: "", descriptionEn: "", order: items.length }}
      />
    </div>
  );
}
