"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, updateUserRole, deleteUser } from "@/lib/actions/users";
import type { UserListItem } from "@/lib/actions/users";

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserListItem[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"EDITOR" | "ADMIN">("EDITOR");
  const [error, setError] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await createUser({ email, name, password, role });
      if (!res.ok) {
        const errs = res.errors;
        if (Array.isArray(errs)) setError(errs.join(", "));
        else if (errs) setError(Object.values(errs).flat().join(", "));
        else setError(res.code);
        return;
      }
      setEmail("");
      setName("");
      setPassword("");
      setRole("EDITOR");
      setShowForm(false);
      router.refresh();
    });
  }

  function handleRoleChange(id: string, newRole: "ADMIN" | "EDITOR") {
    start(async () => {
      const res = await updateUserRole(id, newRole);
      if (!res.ok) {
        const errs = res.errors;
        const msg = Array.isArray(errs)
          ? errs.join(", ")
          : errs
            ? Object.values(errs).flat().join(", ")
            : res.code;
        setError(msg);
        return;
      }
      setError(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    start(async () => {
      const res = await deleteUser(id);
      if (!res.ok) {
        const errs = res.errors;
        const msg = Array.isArray(errs)
          ? errs.join(", ")
          : errs
            ? Object.values(errs).flat().join(", ")
            : res.code;
        setError(msg);
        return;
      }
      setError(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{users.length} user(s)</p>
        <Button onClick={() => setShowForm((v) => !v)} variant={showForm ? "ghost" : "default"}>
          {showForm ? "Cancel" : "Add User"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-lg border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nu-email">Email</Label>
              <Input
                id="nu-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nu-name">Name</Label>
              <Input
                id="nu-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nu-pass">Password (min 10 chars)</Label>
              <Input
                id="nu-pass"
                type="password"
                required
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v: string) => setRole(v as "EDITOR" | "ADMIN")}
                disabled={pending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={pending}>
            Create User
          </Button>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="p-3 font-medium">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="ms-2 text-xs text-muted-foreground">(you)</span>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">
                  {u.id === currentUserId ? (
                    <Badge variant={u.role === "ADMIN" ? "accent" : "secondary"}>{u.role}</Badge>
                  ) : (
                    <Select
                      value={u.role}
                      onValueChange={(v: string) => handleRoleChange(u.id, v as "ADMIN" | "EDITOR")}
                      disabled={pending}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {u.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(u.id)}
                      disabled={pending}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
