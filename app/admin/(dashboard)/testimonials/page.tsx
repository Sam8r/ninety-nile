import { listTestimonials, upsertTestimonial, deleteTestimonial } from "@/lib/actions/structured-content";
import { CrudManager } from "@/components/admin/crud-manager";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const items = await listTestimonials();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Testimonials</h1>
        <p className="text-sm text-muted-foreground">Client references shown on the Clients page.</p>
      </div>
      <CrudManager
        items={items.map((s) => ({ id: s.id, quoteEn: s.quoteEn, authorName: s.authorName, authorRoleEn: s.authorRoleEn ?? "", org: s.org ?? "", order: s.order }))}
        fields={[
          { key: "quoteEn", label: "Quote", textarea: true, required: true },
          { key: "authorName", label: "Author name", required: true },
          { key: "authorRoleEn", label: "Author role" },
          { key: "org", label: "Organisation" },
          { key: "order", label: "Order" },
        ]}
        upsert={upsertTestimonial}
        remove={deleteTestimonial}
        defaultRow={{ quoteEn: "", authorName: "", authorRoleEn: "", org: "", order: items.length }}
      />
    </div>
  );
}
