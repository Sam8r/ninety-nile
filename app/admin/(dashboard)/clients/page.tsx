import { listClients, upsertClient, deleteClient } from "@/lib/actions/structured-content";
import { BilingualCrudManager } from "@/components/admin/bilingual-crud-manager";

export const metadata = { title: "Clients" };

export default async function ClientsAdminPage() {
  const items = await listClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Clients</h1>
        <p className="text-sm text-muted-foreground">Clients shown on the Clients page.</p>
      </div>
      <BilingualCrudManager
        items={items.map((s) => ({ id: s.id, name: s.name, url: s.url ?? "", order: s.order }))}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "url", label: "URL" },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertClient}
        remove={deleteClient}
        defaultRow={{ name: "", url: "", order: items.length }}
      />
    </div>
  );
}
