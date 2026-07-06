"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function LoanSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const leadId = searchParams.get("leadId");

  return (
    <main style={{ maxWidth: 600, margin: "70px auto", padding: 20 }}>
      <h1>Loan Application Submitted</h1>

      <p>Your loan application has been submitted successfully.</p>

      {leadId && (
        <p>
          Application ID: <strong>{leadId}</strong>
        </p>
      )}

      <button
        onClick={() => router.push("/loan/onboard/demo")}
        style={{
          marginTop: 20,
          padding: "12px 18px",
          background: "#7B1FA2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Start New Loan Application
      </button>
    </main>
  );
}