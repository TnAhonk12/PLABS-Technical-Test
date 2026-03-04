"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-kopi-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-kopi-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold text-roast">Kopi Kita</h1>
          <p className="text-kopi-600 mt-1 text-sm">Mini CRM — Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-roast mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast placeholder-kopi-400 focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
              placeholder="mimi@kopikita.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-roast mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-kopi-200 bg-cream px-3 py-2 text-roast placeholder-kopi-400 focus:border-kopi-500 focus:outline-none focus:ring-1 focus:ring-kopi-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-kopi-600 text-white py-2.5 font-medium hover:bg-kopi-700 focus:outline-none focus:ring-2 focus:ring-kopi-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-kopi-500">
          Demo: mimi@kopikita.com / demo123
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-kopi-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-kopi-200 p-8 text-center text-kopi-600">
          Memuat...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
