const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function startKyc(leadId: string) {
  const res = await fetch(`${API_URL}/api/leads/start-kyc-real`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leadId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to start KYC");
  }

  return data;
}