import { getContactDetails, getContactSubmissions } from "@/lib/actions/contact";
import { ContactDetailsForm } from "@/components/admin/contact-details-form";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [details, submissions] = await Promise.all([
    getContactDetails(),
    getContactSubmissions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Contact</h1>
        <p className="text-sm text-muted-foreground">Contact details shown on the public site.</p>
      </div>

      <ContactDetailsForm initial={details} />

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Message</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="align-top hover:bg-muted/30">
                    <td className="p-3 font-medium">{sub.name}</td>
                    <td className="p-3 text-muted-foreground">{sub.email}</td>
                    <td className="p-3 max-w-xs text-muted-foreground">
                      <p className="line-clamp-3">{sub.message}</p>
                    </td>
                    <td className="p-3">
                      <Badge variant={sub.status === "NEW" ? "accent" : "secondary"}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
