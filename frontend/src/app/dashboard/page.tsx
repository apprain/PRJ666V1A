'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your statement sharing and account access.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/share-statement"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📄
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Share Statement
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Generate a secure link for an external party to access a bank statement.
            </p>
          </Link>

                 <Link
            href="/dashboard/shared-links"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ✅
            </div>
             <h2 className="text-xl font-semibold text-slate-800">
              Shared Links
            </h2>
            <p className="mt-2 text-sm text-slate-500">
             View active, expired, and revoked statement sharing links.
            </p>
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🔐
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Access Logs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Track who accessed or downloaded shared statements.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}