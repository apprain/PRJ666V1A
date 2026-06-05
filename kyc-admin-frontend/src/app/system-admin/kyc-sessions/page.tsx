"use client";

import { useEffect, useState } from "react";

export default function SystemAdminKycSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("system_admin_token");

    fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/kyc-sessions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">KYC Sessions Monitoring</h1>

          <a
            href="/system-admin/dashboard"
            className="rounded-lg bg-gray-800 px-4 py-2 text-white"
          >
            Dashboard
          </a>
        </div>

        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No KYC sessions found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Client App</th>
                <th className="border p-3 text-left">Session ID</th>
                <th className="border p-3 text-left">User ID</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Created</th>
                <th className="border p-3 text-left">Completed</th>
                
                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="border p-3">
                    {session.clientApp?.name || "-"}
                  </td>

                  <td className="border p-3 font-mono text-sm">{session.id}</td>

                  <td className="border p-3">{session.userId || "-"}</td>

                  <td className="border p-3">
                    <span
                      className={`rounded px-2 py-1 text-sm ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : session.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>

                  <td className="border p-3">
                    {session.createdAt
                      ? new Date(session.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="border p-3">
                    {session.completedAt
                      ? new Date(session.completedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border p-3">
                    <a
                      href={`/system-admin/kyc-sessions/${session.id}`}
                      className="text-blue-600"
                    >
                      View
                    </a>
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
