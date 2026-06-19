import { listTestimonials, upsertTestimonial, deleteTestimonial } from "@/lib/actions/structured-content";
import { BilingualCrudManager } from "@/components/admin/bilingual-crud-manager";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const items = await listTestimonials();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Testimonials</h1>
        <p className="text-sm text-muted-foreground">Client references shown on the Clients page.</p>
      </div>
      <BilingualCrudManager
        items={items.map((s) => ({ id: s.id, quoteEn: s.quoteEn, quoteAr: s.quoteAr ?? "", authorName: s.authorName, authorRoleEn: s.authorRoleEn ?? "", authorRoleAr: s.authorRoleAr ?? "", org: s.org ?? "", order: s.order }))}
        fields={[
          { key: "quoteEn", label: "Quote (EN)", textarea: true, required: true },
          { key: "quoteAr", label: "Quote (AR)", textarea: true, ar: true },
          { key: "authorName", label: "Author name", required: true },
          { key: "authorRoleEn", label: "Author role (EN)" },
          { key: "authorRoleAr", label: "Author role (AR)", ar: true },
          { key: "org", label: "Organisation" },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertTestimonial}
        remove={deleteTestimonial}
        defaultRow={{ quoteEn: "", quoteAr: "", authorName: "", authorRoleEn: "", authorRoleAr: "", org: "", order: items.length }}
      />
    </div>
  );
}
