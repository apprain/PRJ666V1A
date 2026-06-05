"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

export default function ClientAdminDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("client_admin_token");

    fetch(`${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/admin/kyc/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const createdDate = session.createdAt
        ? new Date(session.createdAt)
        : null;

      if (status !== "all" && session.status !== status) return false;

      if (fromDate && createdDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (createdDate < from) return false;
      }

      if (toDate && createdDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (createdDate > to) return false;
      }

      return true;
    });
  }, [sessions, fromDate, toDate, status]);

  const downloadExcel = () => {
    const rows = filteredSessions.map((session) => ({
      "Session ID": session.id,
      "User ID": session.externalUserId || "-",
      Status: session.status,
      Created: session.createdAt
        ? new Date(session.createdAt).toLocaleString()
        : "-",
      "Face Matched":
        session.faceMatchScore != null
          ? `${session.faceMatchScore.toFixed(2)}%`
          : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "KYC Sessions");
    XLSX.writeFile(workbook, "kyc-sessions.xlsx");
  };

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

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label className="mb-1 block text-sm font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="all">All</option>
              <option value="created">Created</option>
              <option value="uploaded">Uploaded</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setStatus("all");
              }}
              className="w-full rounded border px-4 py-2"
            >
              Clear
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={downloadExcel}
              className="w-full rounded bg-green-600 px-4 py-2 text-white"
            >
              Download Excel
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading sessions...</p>
        ) : filteredSessions.length === 0 ? (
          <p>No KYC sessions found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Session ID</th>
                <th className="border p-3 text-left">User ID</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Created</th>
                <th className="border p-3 text-left">Matched</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td className="border p-3 font-mono text-sm">{session.id}</td>

                  <td className="border p-3">
                    {session.externalUserId || "-"}
                  </td>

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
                    {session.faceMatchScore != null
                      ? `${session.faceMatchScore.toFixed(2)}%`
                      : "-"}
                  </td>

                  <td className="border p-3">
                    <a
                      href={`/client-admin/sessions/${session.id}`}
                      className="text-blue-600 underline"
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
