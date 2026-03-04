"use client";

import { useEffect, useState } from "react";
import { CustomerForm } from "@/components/CustomerForm";
import { CustomerRow } from "@/components/CustomerRow";

type Customer = {
  id: string;
  name: string;
  contact: string | null;
  favoriteDrink: string | null;
  interestTags: string;
  createdAt: string;
  updatedAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  async function fetchCustomers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (tagFilter) params.set("tag", tagFilter);
    const res = await fetch("/api/customers?" + params.toString());
    if (res.ok) {
      const data = await res.json();
      setCustomers(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, [search, tagFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-roast">Pelanggan</h1>
          <p className="text-kopi-600 mt-1 text-sm">Tambah, cari, dan filter pelanggan</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-kopi-600 px-4 py-2 text-sm font-medium text-white hover:bg-kopi-700"
        >
          + Tambah Pelanggan
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Cari nama, kontak, minuman, atau tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-kopi-200 bg-white px-3 py-2 text-sm text-roast placeholder-kopi-400 focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
        />
        <input
          type="text"
          placeholder="Filter by tag (e.g. oat milk, pastry)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="min-w-[180px] rounded-lg border border-kopi-200 bg-white px-3 py-2 text-sm text-roast placeholder-kopi-400 focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
        />
      </div>

      {showForm && (
        <CustomerForm
          customer={editing ?? undefined}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            fetchCustomers();
          }}
        />
      )}

      <div className="rounded-xl border border-kopi-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-kopi-600">Memuat...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-kopi-600">Belum ada pelanggan.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-kopi-200 bg-kopi-50/50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-roast">Nama</th>
                <th className="px-4 py-3 text-sm font-medium text-roast">Kontak</th>
                <th className="px-4 py-3 text-sm font-medium text-roast">Favorit</th>
                <th className="px-4 py-3 text-sm font-medium text-roast">Tags</th>
                <th className="px-4 py-3 text-sm font-medium text-roast w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <CustomerRow
                  key={c.id}
                  customer={c}
                  onEdit={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                  onDeleted={fetchCustomers}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
