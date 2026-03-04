"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type Campaign = {
  id: string;
  theme: string;
  segment: string;
  whyNow: string | null;
  message: string;
  timeWindow: string | null;
  customerCount: number | null;
  createdAt: string;
};

export default function PromoPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function fetchCampaigns() {
    setLoading(true);
    const res = await fetch("/api/promo");
    if (res.ok) {
      const data = await res.json();
      setCampaigns(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function handleGenerate() {
    setError("");
    setGenerating(true);
    const res = await fetch("/api/promo", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setGenerating(false);
    if (res.ok) {
      setCampaigns((prev) => [...(data as Campaign[]), ...prev]);
    } else {
      setError(data.error ?? "Gagal generate promo");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-roast">Promo Ideas</h1>
          <p className="text-kopi-600 mt-1 text-sm">
            AI-generated promo berdasarkan seluruh data pelanggan
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg bg-kopi-600 px-4 py-2 text-sm font-medium text-white hover:bg-kopi-700 disabled:opacity-60"
        >
          {generating ? "Generating..." : "Generate Promo Ideas"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-kopi-200 bg-white p-8 text-center text-kopi-600">
          Memuat...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-xl border border-kopi-200 bg-white p-8 text-center text-kopi-600">
          Belum ada kampanye. Klik &quot;Generate Promo Ideas&quot; (pastikan sudah ada pelanggan dan
          API key AI diisi).
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-kopi-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-semibold text-roast">{c.theme}</h2>
              <p className="mt-1 text-sm text-kopi-600">
                <span className="font-medium">Segment:</span> {c.segment}
                {c.customerCount != null && (
                  <span className="ml-1">({c.customerCount} customers)</span>
                )}
              </p>
              {c.whyNow && (
                <p className="mt-2 text-sm text-kopi-700">
                  <span className="font-medium">Why now:</span> {c.whyNow}
                </p>
              )}
              {c.timeWindow && (
                <p className="mt-1 text-sm text-kopi-600">
                  <span className="font-medium">Best time:</span> {c.timeWindow}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-start gap-2 rounded-lg bg-kopi-50/50 p-4">
                <p className="flex-1 min-w-0 text-sm text-roast">{c.message}</p>
                <CopyButton text={c.message} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
