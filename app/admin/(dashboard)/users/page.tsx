import { listUsers } from "@/lib/actions/users";
import { requireAdmin } from "@/lib/auth-guards";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const current = await requireAdmin("/admin/users");
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage team members who can access the dashboard.
        </p>
      </div>
      <UsersManager users={users} currentUserId={current.id} />
    </div>
  );
}
