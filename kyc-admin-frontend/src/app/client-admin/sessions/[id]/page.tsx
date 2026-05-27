"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("client_admin_token");

    fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/admin/kyc/sessions/${sessionId}/documents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DFDFD" + data);
        if (Array.isArray(data)) {
          setDocuments(data);
        } else {
          console.error(data);
          setDocuments([]);
        }
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-3xl font-bold">KYC Session Review</h1>
        <p className="mb-6 text-sm text-gray-600">Session ID: {sessionId}</p>

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
                  className="max-h-[420px] w-full rounded-lg object-contain border bg-gray-50"
                />

                <p className="mt-3 text-sm text-gray-600">
                  Status: {doc.status}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button className="rounded-lg bg-green-600 px-5 py-3 text-white">
            Approve
          </button>

          <button className="rounded-lg bg-red-600 px-5 py-3 text-white">
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
    </main>
  );
}
