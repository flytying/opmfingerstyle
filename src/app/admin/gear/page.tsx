import { createClient } from "@/lib/supabase/server";
import { GearActions, NewGearForm } from "./actions-client";

export default async function AdminGearPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("gear_products")
    .select("id, slug, name, brand, category, sponsored, active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gear Products</h1>
          <p className="mt-1 text-muted">Manage gear listings and affiliate links.</p>
        </div>
      </div>

      <NewGearForm />

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium text-muted">Product</th>
              <th className="hidden px-4 py-3 font-medium text-muted sm:table-cell">Brand</th>
              <th className="hidden px-4 py-3 font-medium text-muted md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{p.name}</span>
                    {p.sponsored && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Sponsored
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {p.brand || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted capitalize md:table-cell">
                    {p.category.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <GearActions productId={p.id} active={p.active} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  No gear products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
