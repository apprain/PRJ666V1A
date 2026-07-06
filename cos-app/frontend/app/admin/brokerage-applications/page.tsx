"use client";

import { useEffect, useMemo, useState } from "react";
import { getAdminSession } from "@/lib/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BrokerageApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycStatus, setKycStatus] = useState("ALL");
  const [leadStatus, setLeadStatus] = useState("ALL");
  

  useEffect(() => {
    async function loadApplications() {
      try {
        const { tenantId } = getAdminSession();

        if (!tenantId) {
          window.location.href = "/admin/login";
          return;
        }

        const res = await fetch(
          `${API_URL}/api/brokerage/admin/${tenantId}/applications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
          },
        );

        const data = await res.json();

        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        !keyword ||
        app.mobileNo?.toLowerCase().includes(keyword) ||
        app.fullName?.toLowerCase().includes(keyword) ||
        app.documentNumber?.toLowerCase().includes(keyword) ||
        app.id?.toLowerCase().includes(keyword);

      const matchKyc = kycStatus === "ALL" || app.kycStatus === kycStatus;

      const matchLead = leadStatus === "ALL" || app.leadStatus === leadStatus;

      return matchSearch && matchKyc && matchLead;
    });
  }, [applications, search, kycStatus, leadStatus]);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("tenant_id");
    window.location.href = "/admin/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        Loading brokerage applications...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <div>
            <a href="/admin" className="text-sm text-green-600">
              ← Back to Dashboard
            </a>
            <h1 className="mt-3 text-3xl font-bold">Brokerage Applications</h1>
            <p className="mt-1 text-gray-600">
              Review and manage brokerage account opening applications.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 font-semibold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mobile, name, document or ID..."
            className="rounded border px-4 py-3"
          />

          <select
            value={kycStatus}
            onChange={(e) => setKycStatus(e.target.value)}
            className="rounded border px-4 py-3"
          >
            <option value="ALL">All KYC</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={leadStatus}
            onChange={(e) => setLeadStatus(e.target.value)}
            className="rounded border px-4 py-3"
          >
            <option value="ALL">All Status</option>
            <option value="LEAD_CREATED">Lead Created</option>
            <option value="OTP_VERIFIED">OTP Verified</option>
            <option value="PROFILE_ENRICHED">Profile Enriched</option>
            <option value="READY_FOR_REVIEW">Ready for Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setKycStatus("ALL");
              setLeadStatus("ALL");
            }}
            className="rounded bg-gray-700 px-4 py-3 font-semibold text-white"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded border">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b p-3">Mobile</th>
                <th className="border-b p-3">Name</th>
                <th className="border-b p-3">KYC Status</th>
                <th className="border-b p-3">Application Status</th>
                <th className="border-b p-3">Created</th>
                <th className="border-b p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="border-b p-3">{app.mobileNo}</td>
                  <td className="border-b p-3">{app.fullName || "-"}</td>
                  <td className="border-b p-3">
                    <StatusBadge value={app.kycStatus} />
                  </td>
                  <td className="border-b p-3">
                    <StatusBadge value={app.leadStatus} />
                  </td>
                  <td className="border-b p-3">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border-b p-3">
                    <a
                      href={`/admin/brokerage-applications/${app.id}`}
                      className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={6}>
                    No brokerage applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ value }: { value: string }) {
  const color =
    value === "APPROVED" || value === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : value === "REJECTED"
        ? "bg-red-100 text-red-700"
        : value === "READY_FOR_REVIEW"
          ? "bg-green-100 text-blue-700"
          : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {value || "-"}
    </span>
  );
}
