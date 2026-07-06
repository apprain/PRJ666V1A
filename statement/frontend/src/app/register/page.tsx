"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "mobile" | "otp" | "complete";

export default function RegisterPage() {
  const router = useRouter();

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [kycSessionId, setKycSessionId] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("kycSessionId");
    const status = params.get("kycStatus");

    if (sessionId && status === "completed") {
      const savedMobile = sessionStorage.getItem("registrationMobile") || "";

      setMobile(savedMobile);
      setKycSessionId(sessionId);
      setStep("complete");
    }
  }, []);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${serviceUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to send OTP");
        return;
      }

      setDevOtp(data.otp || "");
      setStep("otp");
      setMessage("OTP sent successfully");
    } catch {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const verifyRes = await fetch(`${serviceUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setMessage(verifyData.message || "Invalid OTP");
        return;
      }

      const checkRes = await fetch(`${serviceUrl}/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const checkData = await checkRes.json();

      if (checkData.exists) {
        alert("User already exists. Please login.");
        router.push("/login");
        return;
      }

      sessionStorage.setItem("registrationMobile", mobile);

      await startKyc();
    } catch {
      setMessage("OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function startKyc() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/kyc/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.NEXT_PUBLIC_KYC_CLIENT_ID || "",
          "x-client-secret": process.env.NEXT_PUBLIC_KYC_CLIENT_SECRET || "",
        },
        body: JSON.stringify({
          externalUserId: mobile,
          redirectUrl: process.env.NEXT_PUBLIC_KYC_CALLBACK_URL,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to start KYC");
      return;
    }

    window.location.href = data.verificationUrl;
  }

  async function completeRegistration(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${serviceUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          mobile,
          kycSessionId,
        }),
      });

      const data = await res.json();

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
        return;
      }

      if (data && typeof data === "object" && "id" in data) {
        router.push("/login");
        return;
      }

      setMessage(data?.message || "Registration failed");
    } catch {
      setMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Registration</h1>
          <p className="mt-2 text-sm text-gray-500">
            {step === "complete"
              ? "Create your account"
              : "Verify your mobile before starting KYC"}
          </p>
        </div>

        {step === "mobile" && (
          <form onSubmit={sendOtp}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>

            <input
              className="mb-4 w-full rounded border p-2 text-black"
              type="text"
              placeholder="01711111111"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />

            <button
              className="w-full rounded bg-black p-2 text-white disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Enter OTP
            </label>

            <input
              className="mb-4 w-full rounded border p-2 text-black"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            {devOtp && (
              <p className="mb-3 rounded bg-yellow-50 p-2 text-sm text-yellow-700">
                Development OTP: {devOtp}
              </p>
            )}

            <button
              className="w-full rounded bg-black p-2 text-white disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              type="button"
              className="mt-3 w-full rounded border p-2 text-black"
              onClick={() => setStep("mobile")}
            >
              Change Mobile Number
            </button>
          </form>
        )}

        {step === "complete" && (
          <form onSubmit={completeRegistration}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>

            <input
              className="mb-3 w-full rounded border bg-gray-100 p-2 text-black"
              type="text"
              value={mobile}
              readOnly
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              className="mb-3 w-full rounded border p-2 text-black"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              className="mb-4 w-full rounded border p-2 text-black"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="w-full rounded bg-black p-2 text-white disabled:bg-gray-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-black hover:underline"
          >
            Login now
          </button>
        </p>
      </div>
    </main>
  );
}
