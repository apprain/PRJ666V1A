"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StatementRequest = {
  id: string;
  sourceBankName: string;
  customerName?: string;
  customerMobile?: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  purpose: string;
  notes?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  consentDocumentPath?: string;
  consentDocumentOriginalName?: string;
  consentDocumentMimeType?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function maskAccountNumber(value: string) {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
}

export default function StatementRequestsPage() {
  const router = useRouter();

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [requests, setRequests] = useState<StatementRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<StatementRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  function openPdf(title: string, url: string) {
    setPdfTitle(title);
    setPdfUrl(url);
    setShowPdfViewer(true);
  }

  function closePdfViewer() {
    setShowPdfViewer(false);
    setPdfTitle("");
    setPdfUrl("");
  }

  async function loadRequests() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/corp-login");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${serviceUrl.replace(/\/$/, "")}/statement-requests/organization`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load statement requests.");
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load statement requests.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((request) =>
      [
        request.customerName,
        request.customerMobile,
        request.sourceBankName,
        request.accountNumber,
        request.purpose,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [requests, search]);

  function consentUrl(request: StatementRequest) {
    if (!request.consentDocumentPath) return "";

    return `${serviceUrl.replace(/\/$/, "")}/${request.consentDocumentPath.replace(/\\/g, "/")}`;
  }

  return (
    <main className="px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
            Requests
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Statement Requests
          </h1>
          <p className="mt-3 text-slate-600">
            Requests submitted by your organization.
          </p>
        </div>

        <Link
          href="/organization/request-statement"
          className="rounded-xl bg-[#39aa43] px-5 py-3 text-sm font-bold text-white hover:bg-[#31993a]"
        >
          Request a Statement
        </Link>
      </div>

      <div className="mt-7 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, bank, account, or purpose"
            className="w-full max-w-md rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
          />
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
              <p className="mt-4 text-sm text-slate-500">
                Loading statement requests...
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <h2 className="text-lg font-bold">No statement requests found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Submitted requests will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Source Bank</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {request.customerName || "Not provided"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.customerMobile || "No mobile"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {request.sourceBankName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {maskAccountNumber(request.accountNumber)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(request.startDate)} to{" "}
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {request.purpose}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(request.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                        Approved {/* {request.status} */}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="rounded-lg bg-[#39aa43] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#31993a]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-7 py-6">
              <div>
                <h2 className="text-2xl font-bold">Statement Request</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review the submitted request details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 p-7 sm:grid-cols-2">
              <Detail
                label="Customer"
                value={selectedRequest.customerName || "-"}
              />
              <Detail
                label="Mobile"
                value={selectedRequest.customerMobile || "-"}
              />
              <Detail
                label="Source Bank"
                value={selectedRequest.sourceBankName}
              />
              <Detail
                label="Account Number"
                value={maskAccountNumber(selectedRequest.accountNumber)}
              />
              <Detail
                label="Statement Period"
                value={`${formatDate(selectedRequest.startDate)} to ${formatDate(selectedRequest.endDate)}`}
              />
              <Detail
                label="Expiry"
                value={formatDate(selectedRequest.expiresAt)}
              />
              <Detail label="Purpose" value={selectedRequest.purpose} />
              <Detail label="Status" value={selectedRequest.status} />

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </p>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedRequest.notes || "No notes provided."}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-5">
              {/* {selectedRequest.consentDocumentPath && (
                <a
                  href={consentUrl(selectedRequest)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  View Customer Consent
                </a>
              )} */}

              <button
                type="button"
                onClick={() =>
                  openPdf("Customer Concent", "/concent.pdf")
                }
                className="rounded-xl bg-[#444444] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#444444]"
              >
                Customer Concent
              </button>

              <button
                type="button"
                onClick={() =>
                  openPdf("View Bank Statement", "/sample.pdf")
                }
                className="rounded-xl bg-[#39aa43] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#31993a]"
              >
                View Statement PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  openPdf("Statement Analysis", "/sample-dbr.pdf")
                }
                //onClick={() => window.open("/sample-dbr.pdf", "_blank")}
                className="rounded-xl border border-[#39aa43] bg-white px-5 py-2.5 text-sm font-bold text-[#29953a] hover:bg-green-50"
              >
                View Analysis
              </button>
            </div>
          </div>
        </div>
      )}
      {showPdfViewer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">{pdfTitle}</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Secure document preview
                </p>
              </div>

              <button
                onClick={closePdfViewer}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title={pdfTitle}
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
