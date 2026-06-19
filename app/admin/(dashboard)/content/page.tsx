import { getAllSiteContent } from "@/lib/actions/site-content";
import { SiteContentEditor } from "@/components/admin/site-content-editor";

export const metadata = { title: "Content" };

export default async function ContentPage() {
  const items = await getAllSiteContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Site Content</h1>
        <p className="text-sm text-muted-foreground">Edit section copy shown across the public site.</p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <SiteContentEditor key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
}
