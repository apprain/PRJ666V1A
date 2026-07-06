const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function markOtpVerified(leadId: string) {
  const res = await fetch(`${API_URL}/api/leads/mark-otp-verified`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leadId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to mark OTP verified");
  }

  return data;
}