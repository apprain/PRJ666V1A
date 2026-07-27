"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "mobile" | "otp" | "complete";

type IconName =
  | "shield"
  | "mobile"
  | "check"
  | "user"
  | "mail"
  | "lock"
  | "back"
  | "arrow"
  | "warning";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const props = {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "mobile":
      return (
        <svg {...props}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M10 18h4" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "mail":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "back":
      return (
        <svg {...props}>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h10" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "warning":
      return (
        <svg {...props}>
          <path d="M10.3 3.6 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

const steps = [
  {
    id: "mobile",
    label: "Mobile",
  },
  {
    id: "otp",
    label: "Verification",
  },
  {
    id: "complete",
    label: "Account",
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const kycApiUrl =
    process.env.NEXT_PUBLIC_KYC_API_URL || "https://kyc.apprain.ca";

  const [step, setStep] = useState<Step>("mobile");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [kycSessionId, setKycSessionId] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("kycSessionId");
    const status = params.get("kycStatus");

    if (sessionId && status === "completed") {
      const savedMobile = sessionStorage.getItem("registrationMobile") || "";

      setMobile(savedMobile);
      setKycSessionId(sessionId);
      setStep("complete");
      setMessage("Identity verification completed successfully.");
      setMessageType("success");
    }
  }, []);

  function showError(text: string) {
    setMessage(text);
    setMessageType("error");
  }

  function showSuccess(text: string) {
    setMessage(text);
    setMessageType("success");
  }

  function normalizeMobile(value: string) {
    return value.replace(/[^\d+]/g, "");
  }

  async function sendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${serviceUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showError(data.message || "Failed to send OTP.");
        return;
      }

      setDevOtp(data.otp || "");
      setOtp("");
      setStep("otp");
      showSuccess("OTP sent successfully.");
    } catch (error) {
      console.error("OTP send error:", error);
      showError("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const verifyRes = await fetch(`${serviceUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          otp: otp.trim(),
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        showError(verifyData.message || "The OTP is invalid or expired.");
        return;
      }

      const checkRes = await fetch(`${serviceUrl}/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
        }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        showError(checkData.message || "Unable to verify user status.");
        return;
      }

      if (checkData.exists) {
        showError("An account already exists for this mobile number.");

        window.setTimeout(() => {
          router.push("/login");
        }, 1500);

        return;
      }

      sessionStorage.setItem("registrationMobile", mobile.trim());

      await startKyc();
    } catch (error) {
      console.error("OTP verification error:", error);
      showError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function startKyc() {
    try {
		const res = await fetch(`${serviceUrl}/kyc/start`, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			externalUserId: mobile.trim()
		  }),
		});
         
      const data = await res.json();

      if (!res.ok || !data.verificationUrl) {
        showError(data.message || "Failed to start identity verification.");
        return;
      }

      window.location.href = data.verificationUrl;
    } catch (error) {
      console.error("KYC start error:", error);
      showError("Unable to start identity verification. Please try again.");
    }
  }

  async function completeRegistration(e: FormEvent<HTMLFormElement>) {
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
          email: email.trim(),
          password,
          mobile: mobile.trim(),
          kycSessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data?.message || "Registration failed.");
        return;
      }

      if (data?.access_token) {
        // Keep the same key used by your login and dashboard pages.
        localStorage.setItem("token", data.access_token);

        sessionStorage.removeItem("registrationMobile");
        router.push("/dashboard");
        return;
      }

      if (data && typeof data === "object" && "id" in data) {
        sessionStorage.removeItem("registrationMobile");
        router.push("/login");
        return;
      }

      showError(data?.message || "Registration failed.");
    } catch (error) {
      console.error("Registration error:", error);
      showError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function changeMobileNumber() {
    setStep("mobile");
    setOtp("");
    setDevOtp("");
    setMessage("");
  }

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7faf7] text-[#101828]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(74,222,128,0.12),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(74,222,128,0.10),transparent_28%)]" />

      <header className="relative z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>

              <div className="text-xs text-slate-500">
                Securely Share. Instantly Verify.
              </div>
            </div>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-[#39aa43] bg-white px-4 py-2.5 text-sm font-semibold text-[#29953a] transition hover:bg-[#f1fbf3]"
          >
            Already registered?
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_520px] lg:py-14">
        {/* Left information */}
        <div className="hidden max-w-xl lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-[#278b36]">
            <Icon name="shield" className="h-4 w-4" />
            Secure Digital Registration
          </div>

          <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight">
            Create your
            <span className="mt-2 block text-[#3caf4b]">
              TrustLedger account
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Verify your mobile number, complete identity verification, and
            securely create your customer account.
          </p>

          <div className="mt-9 space-y-5">
            {[
              "Mobile number verification",
              "Secure identity verification",
              "Protected customer account",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7faea] text-[#29953a]">
                  <Icon name="check" className="h-5 w-5" />
                </div>

                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration card */}
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_rgba(16,24,40,0.10)] sm:p-9">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
              Customer Registration
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {step === "mobile" && "Verify your mobile"}
              {step === "otp" && "Enter verification code"}
              {step === "complete" && "Complete your account"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {step === "mobile" &&
                "Enter your mobile number to begin the secure registration process."}

              {step === "otp" &&
                `Enter the verification code sent to ${mobile}.`}

              {step === "complete" &&
                "Your identity verification is complete. Add your login details to finish registration."}
            </p>
          </div>

          {/* Step indicator */}
          <div className="mt-7 flex items-start">
            {steps.map((item, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={item.id}
                  className="flex flex-1 items-start last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition ${
                        isComplete
                          ? "border-[#39aa43] bg-[#39aa43] text-white"
                          : isCurrent
                            ? "border-[#39aa43] bg-green-50 text-[#29953a]"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {isComplete ? (
                        <Icon name="check" className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span
                      className={`mt-2 text-center text-[11px] font-semibold ${
                        isCurrent || isComplete
                          ? "text-[#29953a]"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`mt-4 h-px flex-1 ${
                        index < currentStepIndex
                          ? "bg-[#39aa43]"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {message && (
            <div
              role="alert"
              className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-[#278b36]"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <Icon
                name={messageType === "success" ? "check" : "warning"}
                className="mt-0.5 h-5 w-5 shrink-0"
              />

              <span>{message}</span>
            </div>
          )}

          {/* Mobile step */}
          {step === "mobile" && (
            <form onSubmit={sendOtp} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Mobile Number
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-400">
                    <Icon name="mobile" className="h-5 w-5" />
                  </span>

                  <input
                    id="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(normalizeMobile(event.target.value))
                    }
                    placeholder="01XXX XXX XXX"
                    className={`${inputClass} pl-12`}
                    disabled={loading}
                    required
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Include your country code when entering an international
                  mobile number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <Icon name="arrow" className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP step */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Verification Code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit code"
                  className={`${inputClass} text-center text-xl font-bold tracking-[0.35em]`}
                  disabled={loading}
                  required
                />
              </div>

              {devOtp && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Development environment
                  </p>

                  <p className="mt-1 text-sm text-amber-800">
                    OTP: <strong>{devOtp}</strong>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify and Start KYC
                    <Icon name="arrow" className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={changeMobileNumber}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a] disabled:opacity-50"
              >
                <Icon name="back" className="h-4 w-4" />
                Change Mobile Number
              </button>
            </form>
          )}

          {/* Complete registration step */}
          {step === "complete" && (
            <form onSubmit={completeRegistration} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="verifiedMobile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Verified Mobile Number
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#29953a]">
                    <Icon name="check" className="h-5 w-5" />
                  </span>

                  <input
                    id="verifiedMobile"
                    type="text"
                    value={mobile}
                    readOnly
                    className={`${inputClass} bg-green-50/60 pl-12 text-slate-600`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-400">
                    <Icon name="mail" className="h-5 w-5" />
                  </span>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    className={`${inputClass} pl-12`}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-400">
                    <Icon name="lock" className="h-5 w-5" />
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a secure password"
                    className={`${inputClass} pl-12 pr-16`}
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#29953a] hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Icon name="user" className="h-5 w-5" />
                    Create Customer Account
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#f1fbf3] px-4 py-3 text-xs text-slate-600">
            <Icon name="shield" className="h-4 w-4 text-[#29953a]" />
            Your registration information is securely processed.
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#29953a] hover:underline"
            >
              Login now
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
