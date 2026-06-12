"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";

//const API_URL = "http://localhost:3004";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TenantLeadsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("ALL");
  const [leadFilter, setLeadFilter] = useState("ALL");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const tenant = localStorage.getItem("tenant_id");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    if (tenant !== tenantId) {
      window.location.href = `/admin/${tenant}/leads`;
      return;
    }

    async function loadLeads() {
      try {
        //const response = await fetch(`${API_URL}/api/leads/tenant/${tenantId}`);

        const token = localStorage.getItem("admin_token");

        const response = await fetch(
          `${API_URL}/api/leads/tenant/${tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [tenantId]);

  const filteredLeads = leads.filter((lead) => {
    const q = search.toLowerCase();

    const matchesSearch =
      lead.mobileNo?.toLowerCase().includes(q) ||
      lead.fullName?.toLowerCase().includes(q) ||
      lead.documentNumber?.toLowerCase().includes(q);

    const matchesKyc = kycFilter === "ALL" || lead.kycStatus === kycFilter;
    const matchesLead = leadFilter === "ALL" || lead.leadStatus === leadFilter;
    const leadDate = new Date(lead.createdAt);
    const matchesFromDate = !fromDate || leadDate >= new Date(fromDate);
    const matchesToDate = !toDate || leadDate <= new Date(`${toDate}T23:59:59`);

    return (
      matchesSearch &&
      matchesKyc &&
      matchesLead &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const downloadExcel = () => {
    const rows = filteredLeads.map((lead) => ({
      Mobile: lead.mobileNo,
      Name: lead.fullName,
      Document: lead.documentNumber,
      KYC_Status: lead.kycStatus,
      Lead_Status: lead.leadStatus,
      Face_Match: lead.faceMatchStatus,
      Created: new Date(lead.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(workbook, `${tenantId}-leads.xlsx`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Origination System</h1>
            <p className="mt-2 text-gray-600">
              Tenant: <span className="font-semibold">{tenantId}</span>
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/admin/login";
            }}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search by mobile, name or document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border p-2 md:w-96"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border p-2"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border p-2"
          />

          <div className="flex gap-2">
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="rounded border p-2"
            >
              <option value="ALL">All KYC</option>
              <option value="STARTED">STARTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <select
              value={leadFilter}
              onChange={(e) => setLeadFilter(e.target.value)}
              className="rounded border p-2"
            >
              <option value="ALL">All Leads</option>
              <option value="LEAD_CREATED">LEAD_CREATED</option>
              <option value="OTP_VERIFIED">OTP_VERIFIED</option>
              <option value="KYC_STARTED">KYC_STARTED</option>
              <option value="PROFILE_ENRICHED">PROFILE_ENRICHED</option>
              <option value="READY_FOR_REVIEW">READY_FOR_REVIEW</option>
            </select>

            <button
              onClick={downloadExcel}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Download
            </button>
            <button
              onClick={() => {
                setSearch("");
                setKycFilter("ALL");
                setLeadFilter("ALL");
                setFromDate("");
                setToDate("");
              }}
              className="rounded bg-gray-600 px-4 py-2 text-white"
            >
              Clear
            </button>
          </div>
        </div>
        {loading ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-lg bg-yellow-50 p-6 text-center">
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">Mobile</th>
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Document</th>
                  <th className="border p-3 text-left">KYC Status</th>
                  <th className="border p-3 text-left">Lead Status</th>
                  <th className="border p-3 text-left">Face Match</th>
                  <th className="border p-3 text-left">Created</th>
                  <th className="border p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="border p-3">{lead.mobileNo}</td>

                    <td className="border p-3">{lead.fullName || "-"}</td>

                    <td className="border p-3">{lead.documentNumber || "-"}</td>

                    <td className="border p-3">{lead.kycStatus}</td>

                    <td className="border p-3">{lead.leadStatus}</td>

                    <td className="border p-3">
                      {lead.faceMatchStatus || "-"}
                    </td>

                    <td className="border p-3">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="border p-3 text-center">
                      <a
                        href={`/admin/${tenantId}/leads/${lead.id}`}
                        className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </a>
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
