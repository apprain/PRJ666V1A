"use client";

import { useEffect, useState } from "react";

export default function AdminLandingPage() {
  const [tenantId, setTenantId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const tenant = localStorage.getItem("tenant_id");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    setTenantId(tenant || "demo");
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("tenant_id");
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">COS Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Tenant: {tenantId}</p>
          </div>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <a
            href={`/admin/${tenantId}/leads`}
            className="rounded-xl border bg-gray-50 p-6 hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">Loan Applications</h2>
            <p className="mt-2 text-gray-600">
              View and manage microcredit onboarding applications.
            </p>
          </a>

          <a
            href="/admin/brokerage-applications"
            className="rounded-xl border bg-gray-50 p-6 hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">Brokerage Applications</h2>
            <p className="mt-2 text-gray-600">
              View and review brokerage account opening applications.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}