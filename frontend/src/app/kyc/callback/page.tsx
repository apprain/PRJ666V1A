"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function KycCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();

  const sessionId = params.get("sessionId");
  const [message, setMessage] = useState("Verifying KYC status...");

  useEffect(() => {
    if (!sessionId) {
      setMessage("Missing KYC session ID");
      return;
    }

    fetch(`https://localhost:4000/api/v1/kyc/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "completed") {
          router.push(`/register?kycSessionId=${data.sessionId}&kycStatus=${data.status}`);
        } else {
          setMessage(`KYC status: ${data.status}`);
        }
      })
      .catch(() => {
        setMessage("Failed to verify KYC status");
      });
  }, [sessionId, router]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">KYC Verification Result</h1>
        <p className="mt-4">{message}</p>
      </div>
    </main>
  );
}

export default function KycCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <KycCallbackContent />
    </Suspense>
  );
}