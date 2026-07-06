"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KycCallbackContent() {
  const searchParams = useSearchParams();

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
        const response = await fetch(
          `${API_URL}/api/leads/complete-kyc-by-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              status,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to update profile");
          return;
        }

        setMessage("KYC completed successfully.");
        //console.log(data.lead.id);
        const leadId = data.lead.id;
        window.location.href = `/profile-complete/${leadId}`;


      } catch (error) {
        console.error(error);
        setMessage("Something went wrong.");
      }
    }

    completeKyc();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>{message}</div>
    </div>
  );
}
