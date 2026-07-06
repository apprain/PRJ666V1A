const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function startLoan(tenantId: string, mobileNo: string) {
    const res = await fetch(`${API_URL}/api/loan/start`, {
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
        throw new Error(data.message || "Failed to start loan application");
    }

    return data;
}

export async function saveLoanProfile(
    leadId: string,
    profileData: Record<string, any>
) {
    const res = await fetch(`${API_URL}/api/loan/${leadId}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to save loan profile");
    }

    return data;
}