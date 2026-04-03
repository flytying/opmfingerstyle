import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ApprovalStatus } from "@/lib/supabase/types";

const statusColors: Record<ApprovalStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<ApprovalStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminGuitaristsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("guitarists")
    .select("id, slug, display_name, contact_email, location, approval_status, created_at")
    .order("created_at", { ascending: false });

  if (status && ["draft", "pending_review", "approved", "rejected"].includes(status)) {
    query = query.eq("approval_status", status as ApprovalStatus);
  }

  const { data: guitarists } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guitarists</h1>
          <p className="mt-1 text-muted">Manage guitarist profiles and submissions.</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-2">
        {[
          { value: undefined, label: "All" },
          { value: "pending_review", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/guitarists?status=${tab.value}` : "/admin/guitarists"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value || (!status && !tab.value)
                ? "bg-foreground text-background"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium text-muted">Name</th>
              <th className="hidden px-4 py-3 font-medium text-muted md:table-cell">Email</th>
              <th className="hidden px-4 py-3 font-medium text-muted sm:table-cell">Location</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {guitarists && guitarists.length > 0 ? (
              guitarists.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {g.display_name}
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">
                    {g.contact_email || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {g.location || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[g.approval_status]}`}>
                      {statusLabels[g.approval_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(g.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/guitarists/${g.id}`}
                      className="text-sm font-medium text-primary hover:text-primary-hover"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No guitarists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
