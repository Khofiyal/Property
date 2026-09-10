import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Login | Property By Enci",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Masukkan PIN untuk mengakses dashboard
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-4" action="/api/auth/pin" method="POST">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700">
              PIN Admin
            </label>
            <input
              name="pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
              required
              className="touch-target rounded-lg border border-zinc-300 bg-white p-3 text-center text-xl font-bold tracking-[0.3em] text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="••••"
            />
          </div>
          <button
            type="submit"
            className="touch-target rounded-lg bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98]"
          >
            Masuk
          </button>
          <p className="text-center text-xs text-zinc-400">
            <Link href="/" className="underline hover:text-zinc-600">
              ← Kembali ke Website
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
