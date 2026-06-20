import { listClients, upsertClient, deleteClient } from "@/lib/actions/structured-content";
import { ClientManager } from "@/components/admin/client-manager";

export const metadata = { title: "Clients" };

export default async function ClientsAdminPage() {
  const items = await listClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Clients</h1>
        <p className="text-sm text-muted-foreground">Clients shown on the Clients page. Upload logos for each client.</p>
      </div>
      <ClientManager
        items={items.map((s) => ({
          id: s.id,
          name: s.name,
          url: s.url ?? "",
          order: s.order,
          logoId: s.logoId ?? "",
          logoUrl: s.logo ? `/uploads/${s.logo.path}` : null,
        }))}
        upsert={upsertClient}
        remove={deleteClient}
      />
    </div>
  );
}
