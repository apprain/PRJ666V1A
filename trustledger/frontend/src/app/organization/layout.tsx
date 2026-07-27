"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/organization/dashboard" },
  { label: "Shared Statements", href: "/organization/shared-statements" },
  { label: "Requested Statement List", href: "/organization/statement-requests" },
  { label: "Sent Statements", href: "/organization/sent-statements" },
];

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [organizationName, setOrganizationName] = useState("Organization");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType");
    const storedOrganizationName = localStorage.getItem("organizationName");

    if (!token || accountType !== "corporate") {
      router.replace("/corp-login");
      return;
    }

    if (storedOrganizationName) {
      setOrganizationName(storedOrganizationName);
    }

    setReady(true);
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("organizationName");
    router.replace("/corp-login");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
          <p className="mt-4 text-sm text-slate-500">
            Verifying your organization session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/organization/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] font-bold text-white">
              TL
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>
              <div className="text-xs text-slate-500">Organization Portal</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {organizationName}
              </p>
              <p className="text-xs text-slate-500">Corporate session active</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white px-4 py-6 lg:min-h-[calc(100vh-77px)]">
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#eaf8ec] text-[#278b36]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <Link
              href="/organization/request-statement"
              className="flex w-full items-center justify-center rounded-xl bg-[#39aa43] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#31993a]"
            >
              Request a Statement
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
