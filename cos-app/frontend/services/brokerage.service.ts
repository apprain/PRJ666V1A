const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function startBrokerage(
  tenantId: string,
  mobileNo: string
) {
  const res = await fetch(`${API_URL}/api/brokerage/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenantId,
      mobileNo,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to start brokerage");
  }

  return data;
}

export async function saveBrokerageProfile(
  leadId: string,
  profileData: Record<string, any>
) {
  const res = await fetch(`${API_URL}/api/brokerage/${leadId}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to save brokerage profile");
  }

  return data;
}