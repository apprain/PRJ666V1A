const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendOtp(mobileNo: string) {
    const res = await fetch(`${API_URL}/api/otp/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            mobileNo,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
    }

    return data;
}

export async function verifyOtp(mobileNo: string, otp: string) {
  const res = await fetch(`${API_URL}/api/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mobileNo,
      otpCode: otp,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to verify OTP");
  }

  return data;
}