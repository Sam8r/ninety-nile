import { getBrandSettings } from "@/lib/actions/branding";
import { BrandingForm } from "@/components/admin/branding-form";

export const metadata = { title: "Branding" };

export default async function BrandingPage() {
  const brand = await getBrandSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Branding</h1>
        <p className="text-sm text-muted-foreground">
          Changes go live on the public site within seconds.
        </p>
      </div>
      <BrandingForm initial={brand} />
    </div>
  );
}
