"use client";

import { useState, useEffect } from "react";

type Customer = {
  id: string;
  name: string;
  contact: string | null;
  favoriteDrink: string | null;
  interestTags: string;
};

export function CustomerForm({
  customer,
  onClose,
  onSaved,
}: {
  customer?: Customer;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [favoriteDrink, setFavoriteDrink] = useState("");
  const [interestTags, setInterestTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setContact(customer.contact ?? "");
      setFavoriteDrink(customer.favoriteDrink ?? "");
      setInterestTags(customer.interestTags ?? "");
    }
  }, [customer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        contact: contact.trim() || undefined,
        favoriteDrink: favoriteDrink.trim() || undefined,
        interestTags: interestTags.trim() || undefined,
      };
      const url = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const method = customer ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error?.message ?? "Gagal menyimpan");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-kopi-200 bg-white p-6 shadow-lg">
      <h2 className="font-display font-semibold text-roast">
        {customer ? "Edit Pelanggan" : "Tambah Pelanggan"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-roast mb-1">Nama *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-roast mb-1">Kontak (email/HP)</label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email atau nomor WA"
            className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-roast mb-1">Minuman/Produk favorit</label>
          <input
            value={favoriteDrink}
            onChange={(e) => setFavoriteDrink(e.target.value)}
            placeholder="e.g. Caramel Cold Brew, Oat Latte"
            className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-roast mb-1">Interest tags</label>
          <input
            value={interestTags}
            onChange={(e) => setInterestTags(e.target.value)}
            placeholder="sweet drinks, oat milk, pastry lover, workshop (pisahkan koma)"
            className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-kopi-600 px-4 py-2 text-sm font-medium text-white hover:bg-kopi-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-kopi-200 px-4 py-2 text-sm font-medium text-kopi-600 hover:bg-kopi-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
