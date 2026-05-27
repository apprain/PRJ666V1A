"use client";

import Link from "next/link";

export default function Home() {
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
          externalUserId: "USER-1001",
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

  const sections = [
    {
      title: "Login",
      href: "/login",
      desc: "Access your dashboard",
      icon: "🔐",
      type: "link",
    },
    {
      title: "Registration",
      desc: "Create individual account",
      icon: "👤",
      type: "kyc",
    },
    {
      title: "Corporate",
      href: "/corp-register",
      desc: "Register organization",
      icon: "🏢",
      type: "link",
    },
    {
      title: "Guidelines",
      href: "/process-and-guideline",
      desc: "Read process & help",
      icon: "📘",
      type: "link",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">TrustLedger</h1>

          <p className="mt-2 text-sm text-zinc-600">
            Securely Share. Instantly Verify.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((item) =>
            item.type === "kyc" ? (
              <button
                key={item.title}
                onClick={startKyc}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>

                <h2 className="text-lg font-semibold text-zinc-900">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm text-zinc-600">{item.desc}</p>

                <div className="mt-4 text-sm font-medium text-indigo-600">
                  Continue →
                </div>
              </button>
            ) : (
              <Link
                key={item.title}
                href={item.href || "/"}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>

                <h2 className="text-lg font-semibold text-zinc-900">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm text-zinc-600">{item.desc}</p>

                <div className="mt-4 text-sm font-medium text-indigo-600">
                  Continue →
                </div>
              </Link>
            )
          )}
        </div>

        <div className="mt-10 text-center text-xs text-zinc-500">
          © 2026 TrustLedger
        </div>
      </div>
    </main>
  );
}