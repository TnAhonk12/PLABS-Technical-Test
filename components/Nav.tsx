"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Pelanggan" },
  { href: "/promo", label: "Promo Ideas" },
  { href: "/chat", label: "AI Chat" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-kopi-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="font-display font-semibold text-roast">
          Kopi Kita
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-kopi-100 text-kopi-800"
                  : "text-kopi-600 hover:bg-kopi-50 hover:text-roast"
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-2 rounded-lg px-3 py-2 text-sm text-kopi-600 hover:bg-kopi-50 hover:text-roast"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
