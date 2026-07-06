"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KycCallbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const leadId = params.leadId as string;

  const [message, setMessage] = useState("Processing KYC...");

  useEffect(() => {
    async function completeKyc() {
      const sessionId = searchParams.get("sessionId");
      const status = searchParams.get("status");

      if (!sessionId) {
        setMessage("Invalid KYC session");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/leads/complete-kyc-by-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            status,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to update KYC profile");
          return;
        }

         const leadId = data.lead.id;
        window.location.href = `/brokerage/profile-complete/${leadId}`;
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while processing KYC.");
      }
    }

    completeKyc();
  }, [leadId, searchParams]);

  return (
    <div style={{ padding: 40 }}>
      <p>{message}</p>
    </div>
  );
}