'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('access_token');

    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <section className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600">
          Welcome to the dashboard.
        </p>
      </section>
    </main>
  );
}