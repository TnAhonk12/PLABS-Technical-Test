"use client";

type Customer = {
  id: string;
  name: string;
  contact: string | null;
  favoriteDrink: string | null;
  interestTags: string;
};

export function CustomerRow({
  customer,
  onEdit,
  onDeleted,
}: {
  customer: Customer;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  async function handleDelete() {
    if (!confirm("Hapus pelanggan ini?")) return;
    const res = await fetch(`/api/customers/${customer.id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
  }

  return (
    <tr className="border-b border-kopi-100 hover:bg-kopi-50/30">
      <td className="px-4 py-3 text-roast font-medium">{customer.name}</td>
      <td className="px-4 py-3 text-sm text-kopi-600">{customer.contact || "—"}</td>
      <td className="px-4 py-3 text-sm text-kopi-600">{customer.favoriteDrink || "—"}</td>
      <td className="px-4 py-3 text-sm text-kopi-600">
        {customer.interestTags ? (
          <span className="inline-flex flex-wrap gap-1">
            {customer.interestTags.split(",").map((t) => (
              <span
                key={t}
                className="rounded-full bg-kopi-100 px-2 py-0.5 text-xs text-kopi-700"
              >
                {t.trim()}
              </span>
            ))}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm font-medium text-kopi-600 hover:text-kopi-800"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}
