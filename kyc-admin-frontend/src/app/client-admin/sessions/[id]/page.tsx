"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<any>(null);
  const [remarks, setRemarks] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("client_admin_token");

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
      } finally {
        setLoading(false);
      }

      await fetch(
        `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/admin/kyc/sessions/${sessionId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setDocuments(Array.isArray(data) ? data : []);
        })
        .finally(() => setLoading(false));
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

  if (!session || session.statusCode) {
    return <main className="p-8">Session not found.</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-3xl font-bold">KYC Session Review</h1>
        <p className="mb-6 text-sm text-gray-600">Session ID: {sessionId}</p>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <h2 className="mb-3 text-xl font-semibold">Session Info</h2>
            <p>
              <b>Session ID:</b> {session.id}
            </p>
            <p>
              <b>Status:</b> {session.status}
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
            <p>
              <b>Face matched:</b>{" "}
              {session.faceMatchScore != null
                ? `${session.faceMatchScore.toFixed(2)}%`
                : "-"}
            </p>
            <p>
              <b>Confidence:</b>{" "}
              {session.faceMatchConfidence != null
                ? `${session.faceMatchConfidence.toFixed(2)}%`
                : "-"}
            </p>
            <p>
              <b>Face Match Status:</b>{" "}
              <span
                className={
                  session.faceMatchStatus === "matched"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {session.faceMatchStatus === "matched"
                  ? "✓ Matched"
                  : "✗ Not Matched"}
              </span>
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents found for this session.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border p-4">
                <h2 className="mb-3 text-xl font-semibold">{doc.type}</h2>

                <img
                  src={doc.signedUrl}
                  alt={doc.type}
                  className="max-h-[420px] w-full rounded-lg border bg-gray-50 object-contain"
                />

                <p className="mt-3 text-sm text-gray-600">
                  Status: {doc.status}
                </p>
                <p className="mt-3 text-sm text-gray-600">{doc.ocrFullText}</p>
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

            <a
              href="/client-admin/dashboard"
              className="rounded-lg bg-gray-700 px-5 py-3 text-white"
            >
              Back
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
