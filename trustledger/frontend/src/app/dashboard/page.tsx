"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type IconName =
  | "statement"
  | "links"
  | "logs"
  | "shield"
  | "logout"
  | "arrow"
  | "check"
  | "clock"
  | "document";

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "statement":
    case "document":
      return (
        <svg {...props}>
          <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );

    case "links":
      return (
        <svg {...props}>
          <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
        </svg>
      );

    case "logs":
      return (
        <svg {...props}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );

    case "logout":
      return (
        <svg {...props}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

const dashboardItems = [
  {
    title: "Share Statement",
    description:
      "Create a secure sharing request and provide statement access to an authorized recipient.",
    href: "/dashboard/share-statement",
    icon: "statement" as IconName,
    action: "Create secure link",
  },
  {
    title: "Shared Links",
    description:
      "Review active, expired, and revoked statement-sharing links from one place.",
    href: "/dashboard/shared-links",
    icon: "links" as IconName,
    action: "View shared links",
  },
  {
    title: "Access Logs",
    description:
      "Track statement views, downloads, recipient activity, and verification events.",
    href: "/dashboard/access-logs",
    icon: "logs" as IconName,
    action: "Review access logs",
  },
];

const summaryItems = [
  {
    label: "Active Links",
    value: "4",
    icon: "links" as IconName,
  },
  {
    label: "Statements Shared",
    value: "12",
    icon: "document" as IconName,
  },
  {
    label: "Verified Access",
    value: "9",
    icon: "check" as IconName,
  },
  {
    label: "Expiring Soon",
    value: "2",
    icon: "clock" as IconName,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
          <p className="mt-4 text-sm text-slate-500">
            Verifying your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>
              <div className="text-xs text-slate-500">
                Secure Statement Sharing
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Customer Account
              </p>
              <p className="text-xs text-slate-500">Secure session active</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Icon name="logout" className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Welcome */}
        <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eef9ef] px-3 py-1.5 text-xs font-semibold text-[#278b36]">
                <span className="h-2 w-2 rounded-full bg-[#39aa43]" />
                Secure account access
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome to your dashboard
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Manage statement sharing, review recipient access, and monitor
                activity from your secure TrustLedger account.
              </p>
            </div>

            <Link
              href="/dashboard/share-statement"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.2)] transition hover:bg-[#31993a]"
            >
              <Icon name="statement" className="h-5 w-5" />
              Share a Statement
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf9ef] text-[#29953a]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Current
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-[#101828]">
                {item.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Main actions */}
        <div className="mt-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
              Statement Management
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage your statement-sharing activity
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Select an option below to continue.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {dashboardItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[250px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#eaf8ec] text-[#29953a] transition group-hover:bg-[#39aa43] group-hover:text-white">
                  <Icon name={item.icon} className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#101828]">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#29953a]">
                  {item.action}
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-green-100 bg-[#f0faf2] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#29953a]">
              <Icon name="shield" className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                Your account activity is protected
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                TrustLedger records important sharing and access activity to
                support transparency and accountability.
              </p>
            </div>
          </div>

          <Link
            href="/process-and-guideline"
            className="shrink-0 text-sm font-semibold text-[#29953a] hover:underline"
          >
            View security guidelines
          </Link>
        </div>
      </section>
    </main>
  );
}
