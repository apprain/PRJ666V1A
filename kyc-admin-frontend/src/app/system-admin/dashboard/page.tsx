"use client";

import { useEffect, useState } from "react";

export default function SystemAdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("system_admin_user");

    if (saved) {
      setAdmin(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl justify-between bg-white p-6 shadow flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Admin Dashboard</h1>

            <p className="mt-2 text-gray-600">Welcome {admin?.name || ""}</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/system-admin/login";
            }}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <a
            href="/system-admin/client-apps"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">Client Apps</h2>
            <p className="mt-2 text-gray-500">Manage tenants</p>
          </a>

          <a
            href="/system-admin/client-admins"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">Client Admins</h2>
            <p className="mt-2 text-gray-500">Manage client users</p>
          </a>

          <a
            href="/system-admin/kyc-sessions"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">KYC Sessions</h2>
            <p className="mt-2 text-gray-500">Monitor activity</p>
          </a>

          <a
            href="/system-admin/settings"
            className="rounded-2xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="mt-2 text-gray-500">Platform settings</p>
          </a>
        </div>
      </div>
    </main>
  );
}
