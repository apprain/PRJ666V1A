"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SystemAdminKycSessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [remarks, setRemarks] = useState("");
  const [session, setSession] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("system_admin_token");

    async function loadData() {
      try {
        const sessionRes = await fetch(
          //`${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/kyc/sessions/${sessionId}`,
          `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/kyc-sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const sessionData = await sessionRes.json();
        setSession(sessionData);

        const docsRes = await fetch(
          `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/kyc-sessions/${sessionId}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const docsData = await docsRes.json();
        setDocuments(Array.isArray(docsData) ? docsData : []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
   
  }, [sessionId]);

  async function reviewSession(action: "approve" | "reject") {
      const token = localStorage.getItem("system_admin_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/kyc-sessions/${sessionId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ remarks }),
        },
      );

      if (!res.ok) {
        alert("Review failed");
        return;
      }

      alert(action === "approve" ? "KYC approved" : "KYC rejected");
      window.location.reload();
    }

  if (loading) {
    return <main className="p-8">Loading session...</main>;
  }

  if (!session || session.statusCode) {
    return <main className="p-8">Session not found.</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">KYC Session Detail</h1>

          <a
            href="/system-admin/kyc-sessions"
            className="rounded-lg bg-gray-800 px-4 py-2 text-white"
          >
            Back
          </a>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <h2 className="mb-3 text-xl font-semibold">Session Info</h2>
            <p>
              <b>Session ID:</b> {session.id}
            </p>
            <p>
              <b>Status:</b> {session.status}
                <b>Status:</b> 
            </p>

            <p>
              <b>Review Status:</b> {session.reviewStatus || "pending"}
            </p>
            <p>
              <b>Reviewed By:</b> {session.reviewedBy || "-"}
            </p>
            <p>
              <b>Reviewed At:</b>{" "}
              {session.reviewedAt
                ? new Date(session.reviewedAt).toLocaleString()
                : "-"}
            </p>
            <p>
              <b>Remarks:</b> {session.reviewRemarks || "-"}
            </p>

            <p>
              <b>External User:</b> {session.externalUserId || "-"}
            </p>
            <p>
              <b>Created:</b>{" "}
              {session.createdAt
                ? new Date(session.createdAt).toLocaleString()
                : "-"}
            </p>
            <p>
              <b>Completed:</b>{" "}
              {session.completedAt
                ? new Date(session.completedAt).toLocaleString()
                : "-"}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="mb-3 text-xl font-semibold">Client App</h2>
            <p>
              <b>Name:</b> {session.clientApp?.name || "-"}
            </p>
            <p>
              <b>Client ID:</b> {session.clientApp?.clientId || "-"}
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold">Documents</h2>

        {documents.length === 0 ? (
          <p>No documents uploaded for this session.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {documents.map((doc: any) => (
              <div key={doc.id} className="rounded-xl border p-4">
                <h3 className="mb-2 text-xl font-semibold">
                  {doc.type || doc.documentType}
                  
                </h3>

                {doc.signedUrl ? (
                  <img
                    src={doc.signedUrl}
                    alt={doc.type || doc.documentType}
                    className="max-h-[420px] w-full rounded-lg  bg-gray-50 object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Signed URL not available.
                  </p>
                )}

                <p className="mt-3 text-sm text-gray-600">
                  Status: {doc.status}
                </p>
                <p className="mt-3 text-sm text-gray-600">  
                   {doc.ocrFullText}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl border p-4">
          <h2 className="mb-4 text-2xl font-bold">Review Decision</h2>

          <textarea
            className="mb-4 h-28 w-full rounded-lg border p-3"
            placeholder="Write review remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={() => reviewSession("approve")}
              className="rounded-lg bg-green-600 px-5 py-3 text-white"
            >
              Approve
            </button>

            <button
              onClick={() => reviewSession("reject")}
              className="rounded-lg bg-red-600 px-5 py-3 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
