import Link from "next/link";
import { prisma } from "@/lib/db";
import { CopyButton } from "@/components/CopyButton";

export const dynamic = "force-dynamic";

function getTopTags(customers: { interestTags: string }[]) {
  const counts: Record<string, number> = {};
  for (const c of customers) {
    const tags = c.interestTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    for (const t of tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

export default async function DashboardPage() {
  const [customers, campaigns] = await Promise.all([
    prisma.customer.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.promoCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const topInterests = getTopTags(customers);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-roast">Dashboard</h1>
        <p className="text-kopi-600 mt-1">Ringkasan minggu ini</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-kopi-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-kopi-600">Total Pelanggan</p>
          <p className="mt-1 text-3xl font-display font-semibold text-roast">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-kopi-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-kopi-600">Kampanye Disarankan</p>
          <p className="mt-1 text-3xl font-display font-semibold text-roast">{campaigns.length}</p>
        </div>
        <div className="rounded-xl border border-kopi-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-kopi-600">Top Interest</p>
          <p className="mt-1 text-xl font-display font-semibold text-roast">
            {topInterests[0] ? `${topInterests[0][0]} (${topInterests[0][1]})` : "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-kopi-200 bg-white p-5 shadow-sm">
          <h2 className="font-display font-semibold text-roast">Top Interests</h2>
          <ul className="mt-3 space-y-2">
            {topInterests.length
              ? topInterests.map(([tag, count]) => (
                  <li key={tag} className="flex justify-between text-sm">
                    <span className="text-roast">{tag}</span>
                    <span className="text-kopi-600">{count}</span>
                  </li>
                ))
              : "Belum ada data."}
          </ul>
        </div>

        <div className="rounded-xl border border-kopi-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-roast">Kampanye Minggu Ini</h2>
            <Link
              href="/promo"
              className="text-sm font-medium text-kopi-600 hover:text-kopi-800"
            >
              Generate →
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {campaigns.length
              ? campaigns.map((c) => (
                  <li key={c.id} className="rounded-lg border border-kopi-100 bg-kopi-50/50 p-3">
                    <p className="font-medium text-roast">{c.theme}</p>
                    <p className="mt-1 text-sm text-kopi-600">{c.segment}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="flex-1 text-sm text-roast line-clamp-2">{c.message}</p>
                      <CopyButton text={c.message} />
                    </div>
                  </li>
                ))
              : "Generate promo ideas di halaman Promo Ideas."}
          </ul>
        </div>
      </div>
    </div>
  );
}
