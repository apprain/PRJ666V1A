"use client";

import { useEffect, useState } from "react";

export default function SystemAdminClientAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("system_admin_token");

    fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/client-admins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setAdmins(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Client Admins</h1>

          <div>
            <a
              href="/system-admin/dashboard"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Dashboard
            </a>
            {' '}
            <a
              href="/system-admin/client-admins/create"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              + Create Client Admin
            </a>
          </div>
        </div>

        {loading ? (
          <p>Loading client admins...</p>
        ) : admins.length === 0 ? (
          <p>No client admins found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Client App</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Created</th>
                
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="border p-3">{admin.name}</td>
                  <td className="border p-3">{admin.email}</td>
                  <td className="border p-3">{admin.clientApp?.name}</td>
                  <td className="border p-3">{admin.role}</td>
                  <td className="border p-3">{admin.status}</td>
                  <td className="border p-3">
                    {new Date(admin.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
