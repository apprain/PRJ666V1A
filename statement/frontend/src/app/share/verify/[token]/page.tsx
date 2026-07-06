"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ShareData = {
  id: number;
  bankName: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
};

export default function VerifySharePage() {
  const params = useParams();
  const router = useRouter();

  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [share, setShare] = useState<ShareData | null>(null);
  const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      router.push(`/login?redirect=/share/verify/${token}`);
      return;
    }
    verifyShareLink();
  }, [token]);

  const verifyShareLink = async () => {
    try {
      //const res = await fetch(serviceUrl + '/auth/' + loginUrl, {
      const response = await fetch(
         `${serviceUrl}/statement-shares/verify/${token}`
      );

      const data = await response.json();

      setValid(data.valid);
      setMessage(data.message);
      setShare(data.data || null);
    } catch {
      setValid(false);
      setMessage("Unable to verify this share link.");
    } finally {
      setLoading(false);
    }
  };

  const downloadStatement = async () => {

    //http://localhost:3000/statement-shares/verify/3baa3987-1b9a-4e6b-b2f7-ec6835911858
    try {
      const response = await fetch(
        `${serviceUrl}/statement-shares/download/${token}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        alert("Failed to generate statement");
        return;
      }

       const link = document.createElement("a");
        link.href = "/sample.pdf";
        link.download = "statement.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();
      

/*      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement-${token}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
*/

    } catch (error) {
      console.error(error);
      alert("Unable to download statement");
    }
  };

  

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">
          Checking share link...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Bank Statement Access
        </h1>

        <p className="mb-6 text-gray-600">
          Verify the shared statement details before downloading.
        </p>

        {!valid ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{message}</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 font-medium text-green-700">
              {message}
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Bank</p>
                <p className="font-semibold">{share?.bankName}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-semibold">{share?.accountNumber}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{share?.startDate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold">{share?.endDate}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-500">Expires At</p>
                <p className="font-semibold">
                  {share?.expiresAt
                    ? new Date(share.expiresAt).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>

            <button
              onClick={downloadStatement}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Download Statement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
