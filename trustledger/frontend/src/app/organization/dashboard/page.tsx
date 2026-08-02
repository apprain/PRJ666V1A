"use client";

import Link from "next/link";

const items = [
  {
    title: "Customer's Shared Statement",
    description: "View statements received by your organization.",
    href: "/organization/shared-statements",
  },
  {
    title: "Requested Statement List",
    description: "Review requests submitted by your organization.",
    href: "/organization/statement-requests",
  },
  {
    title: "Sent Statements",
    description: "View statements shared by your organization.",
    href: "/organization/sent-statements",
  },
  {
    title: "Request a Statement",
    description: "Create a new bank-to-bank statement request.",
    href: "/organization/request-statement",
  },
];

export default function OrganizationDashboardPage() {

  const storedOrganizationName = localStorage.getItem("organizationName");

  return (
    <main className="px-5 py-8 sm:px-8 sm:py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
          Corporate Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {storedOrganizationName} Dashboard
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Select an option below to manage statement activity.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[210px] flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8ec] text-lg font-bold text-[#29953a]">
              →
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {item.title}
            </h2>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {item.description}
            </p>

            <div className="mt-5 text-sm font-bold text-[#29953a]">
              Open module →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
