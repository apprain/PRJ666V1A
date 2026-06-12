"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const API_URL = "http://localhost:3004";

export default function OnboardPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const [mobileNo, setMobileNo] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info",
  );
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [leadId, setLeadId] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [startingKyc, setStartingKyc] = useState(false);

  const showMessage = (
    text: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  const isValidMobile = (value: string) => /^01\d{9}$/.test(value);

  const sendOtp = async () => {
    if (!mobileNo.trim()) {
      showMessage("Please enter your mobile number.", "error");
      return;
    }

    if (!isValidMobile(mobileNo)) {
      showMessage("Please enter a valid mobile number.", "error");
      return;
    }

    setSendingOtp(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        showMessage(
          data.devOtp
            ? `OTP sent successfully. Dev OTP: ${data.devOtp}`
            : "OTP sent successfully.",
          "success",
        );
      } else {
        showMessage(data.message || "Failed to send OTP.", "error");
      }
    } catch {
      showMessage("Unable to send OTP. Please try again.", "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode.trim()) {
      showMessage("Please enter the OTP code.", "error");
      return;
    }

    if (otpCode.length < 4) {
      showMessage("Please enter a valid OTP code.", "error");
      return;
    }

    setVerifyingOtp(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNo, otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Invalid OTP.", "error");
        return;
      }

      const leadResponse = await fetch(`${API_URL}/api/leads/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenantSlug, mobileNo }),
      });

      const leadData = await leadResponse.json();

      if (!leadResponse.ok) {
        showMessage(
          leadData.message || "Failed to start customer journey.",
          "error",
        );
        return;
      }

      setLeadId(leadData.lead.id);

      await fetch(`${API_URL}/api/leads/mark-otp-verified`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadData.lead.id }),
      });

      setOtpVerified(true);
      showMessage(
        "Mobile number verified successfully, You can now start.",
        "success",
      );
    } catch {
      showMessage("Unable to verify OTP. Please try again.", "error");
    } finally {
      setVerifyingOtp(false);
    }
  };

  async function startKyc() {
    if (!leadId) {
      showMessage(
        "Lead information is missing. Please verify OTP again.",
        "error",
      );
      return;
    }

    setStartingKyc(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/leads/start-kyc-real`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to start KYC.", "error");
        return;
      }

      window.location.href = data.verificationUrl;
    } catch {
      showMessage("Unable to start KYC. Please try again.", "error");
    } finally {
      setStartingKyc(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-6 text-center">

          <h1 className="text-2xl font-bold text-slate-900">
            Customer Onboarding
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Verify your mobile number to continue.
          </p>

          <p className="mt-1 text-xs text-slate-400">{tenantSlug}</p>
        </div>


        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Mobile Number
          </label>

          <input
            type="tel"
            placeholder="01XXXXXXXXX"
            value={mobileNo}
            disabled={otpSent}
            onChange={(e) => setMobileNo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600 disabled:bg-slate-100"
          />
        </div>

        {/* Send OTP */}
        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={sendingOtp}
            className="mt-5 w-full rounded-lg bg-green-600 p-3 font-semibold text-white hover:bg-green-700 disabled:bg-slate-400"
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* Verify OTP */}
        {otpSent && !otpVerified && (
          <>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                OTP Code
              </label>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-green-600"
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={verifyingOtp}
              className="mt-5 w-full rounded-lg bg-green-600 p-3 font-semibold text-white hover:bg-green-700 disabled:bg-slate-400"
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtpCode("");
                setMessage("");
              }}
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Change Mobile Number
            </button>
          </>
        )}

        {/* Start KYC */}
        {otpVerified && (
          <button
            onClick={startKyc}
            disabled={startingKyc}
            className="mt-5 w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800 disabled:bg-slate-400"
          >
            {startingKyc ? "Starting KYC..." : "Continue to KYC Verification"}
          </button>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mt-5 rounded-lg border p-3 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
