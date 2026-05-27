"use client";

import { useEffect, useState } from "react";

export default function ClientAdminDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("client_admin_token");

    fetch(`${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/admin/kyc/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">KYC Sessions</h1>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/client-admin/login";
            }}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No KYC sessions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">User</th>

                  <th className="border p-3 text-left">Status</th>

                  <th className="border p-3 text-left">Created</th>

                  <th className="border p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-3">{item.externalUserId}</td>

                    <td className="border p-3">{item.status}</td>

                    <td className="border p-3">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                    <td className="border p-3">
                      {item.status === "completed" ? (
                        <a
                          href={`/client-admin/sessions/${item.id}`}
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">Not ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
