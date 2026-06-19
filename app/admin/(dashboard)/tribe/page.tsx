import { listTeamMembers, upsertTeamMember, deleteTeamMember } from "@/lib/actions/structured-content";
import { BilingualCrudManager } from "@/components/admin/bilingual-crud-manager";

export const metadata = { title: "Tribe" };

export default async function TribeAdminPage() {
  const items = await listTeamMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Our Tribe</h1>
        <p className="text-sm text-muted-foreground">Team members shown on the Tribe page.</p>
      </div>
      <BilingualCrudManager
        items={items.map((s) => ({ id: s.id, nameEn: s.nameEn, nameAr: s.nameAr ?? "", roleEn: s.roleEn ?? "", roleAr: s.roleAr ?? "", bioEn: s.bioEn ?? "", bioAr: s.bioAr ?? "", status: s.status, order: s.order }))}
        fields={[
          { key: "nameEn", label: "Name (EN)", required: true },
          { key: "nameAr", label: "Name (AR)", ar: true },
          { key: "roleEn", label: "Role (EN)" },
          { key: "roleAr", label: "Role (AR)", ar: true },
          { key: "bioEn", label: "Bio (EN)", textarea: true },
          { key: "bioAr", label: "Bio (AR)", textarea: true, ar: true },
          { key: "status", label: "Status" },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertTeamMember}
        remove={deleteTeamMember}
        defaultRow={{ nameEn: "", nameAr: "", roleEn: "", roleAr: "", bioEn: "", bioAr: "", status: "DRAFT", order: items.length }}
      />
    </div>
  );
}
