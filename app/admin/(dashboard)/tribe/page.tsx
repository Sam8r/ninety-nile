import { listTeamMembers, upsertTeamMember, deleteTeamMember } from "@/lib/actions/structured-content";
import { CrudManager } from "@/components/admin/crud-manager";

export const metadata = { title: "Tribe" };

export default async function TribeAdminPage() {
  const items = await listTeamMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Our Tribe</h1>
        <p className="text-sm text-muted-foreground">Team members shown on the Tribe page.</p>
      </div>
      <CrudManager
        items={items.map((s) => ({ id: s.id, nameEn: s.nameEn, roleEn: s.roleEn ?? "", bioEn: s.bioEn ?? "", status: s.status, order: s.order }))}
        fields={[
          { key: "nameEn", label: "Name", required: true },
          { key: "roleEn", label: "Role" },
          { key: "bioEn", label: "Bio", textarea: true },
          { key: "status", label: "Status" },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertTeamMember}
        remove={deleteTeamMember}
        defaultRow={{ nameEn: "", roleEn: "", bioEn: "", status: "DRAFT", order: items.length }}
      />
    </div>
  );
}
