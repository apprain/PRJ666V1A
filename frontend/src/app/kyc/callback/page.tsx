"use client";

import { useEffect, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";


export default function KycCallbackPage() {
  const params = useSearchParams();
  const sessionId = params.get("sessionId");
  const router = useRouter();
  const [kycStatus, setKycStatus] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) return;
    //https://localhost:4000/api/v1/kyc/sessions/cec370db848a4f7c0634505b26dcc1d99f8e4abc7b3e66cefb45a5aac58586f0/complete
    //fetch(`https://localhost:4000/api/v1/kyc/sessions/${sessionId}/status`)
    fetch(`https://localhost:4000/api/v1/kyc/sessions/${sessionId}/complete`)
      .then((res) => res.json())
      .then((data) => {
         if (data.status === "completed") {
          router.push(`/register?kycSessionId=${data.sessionId}&kycStatus=${data.status}`);
        } else {
         alert(`KYC status: ${data.status}`);
        }
      })
      .catch(() => setKycStatus({ error: "Failed to verify KYC status" }));
  }, [sessionId]);

  return (
    
    

    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">KYC Verification Result</h1>

        {!kycStatus ? (
          <p className="mt-4">Verifying KYC status...</p>
        ) : kycStatus.error ? (
          <p className="mt-4 text-red-600">{kycStatus.error}</p>
        ) : (
          <>
            <p className="mt-4">Session ID: {kycStatus.sessionId}</p>
            <p>Status: {kycStatus.status}</p>
            <p>User: {kycStatus.redirectUrl}</p>
          </>
        )}
      </div>
    </main>

    
  );
}