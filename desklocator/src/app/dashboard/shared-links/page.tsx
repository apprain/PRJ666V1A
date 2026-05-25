"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SharedLinksPage() {
  const router = useRouter();

  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";



  useEffect(() => {
    fetch(serviceUrl + "/statement-shares", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-lg">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Shared Statements
            </h1>

            <p className="mt-1 text-gray-600">
              View all generated statement share links.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading shared statements...
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            No shared statements found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    Bank
                  </th>

                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    Account
                  </th>

                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    Start Date
                  </th>

                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    End Date
                  </th>

                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    Expires At
                  </th>

                  <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {links.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="border-b p-3 text-sm text-gray-700">
                      {item.bankName}
                    </td>

                    <td className="border-b p-3 text-sm text-gray-700">
                      {item.accountNumber}
                    </td>

                    <td className="border-b p-3 text-sm text-gray-700">
                      {formatDate(item.startDate)}
                    </td>

                    <td className="border-b p-3 text-sm text-gray-700">
                      {formatDate(item.endDate)}
                    </td>

                    <td className="border-b p-3 text-sm text-gray-700">
                      {formatDate(item.expiresAt)}
                    </td>

                    <td className="border-b p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}