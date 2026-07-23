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

  const cards = [
    {
      title: 'Reserve Workspace',
      description: 'Choose a desk, select a time, and add the services you need.',
      href: '/dashboard/reserve-workspace',
      icon: '▦',
      iconClass: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'My Reservations',
      description: 'View upcoming, completed, and cancelled workspace bookings.',
      href:"/dashboard/my-reservations",
      icon: '✓',
      iconClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Access & Activity Logs',
      description: 'Review reservation activity and workspace access history.',
      href: '#',
      icon: '⌁',
      iconClass: 'bg-violet-50 text-violet-700',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Workspace Portal
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-500">
              Reserve a workspace and manage your upcoming bookings.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 sm:w-auto"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${card.iconClass}`}
              >
                {card.icon}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {card.title}
                </h2>
                <span className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}