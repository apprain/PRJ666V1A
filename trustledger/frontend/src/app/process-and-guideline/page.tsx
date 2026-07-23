"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type IconName =
  | "shield"
  | "back"
  | "check"
  | "user"
  | "building"
  | "link"
  | "document"
  | "clock"
  | "download"
  | "support";

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
    case "back":
      return (
        <svg {...props}>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h10" />
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

    case "building":
      return (
        <svg {...props}>
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
          <path d="M16 9h3a2 2 0 0 1 2 2v10" />
          <path d="M9 7h3" />
          <path d="M9 11h3" />
          <path d="M9 15h3" />
        </svg>
      );

    case "link":
      return (
        <svg {...props}>
          <path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
        </svg>
      );

    case "document":
      return (
        <svg {...props}>
          <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "download":
      return (
        <svg {...props}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "support":
      return (
        <svg {...props}>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h2v-7H4Z" />
          <path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h4Z" />
          <path d="M16 19c0 1.1-.9 2-2 2h-2" />
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

const customerSteps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Register as a TrustLedger customer and complete the required identity verification process.",
    icon: "user" as IconName,
  },
  {
    number: "02",
    title: "Select Your Statement",
    description:
      "Choose the bank account and statement period that you want to share.",
    icon: "document" as IconName,
  },
  {
    number: "03",
    title: "Set Access Controls",
    description:
      "Define the expiry date and maximum number of permitted downloads.",
    icon: "clock" as IconName,
  },
  {
    number: "04",
    title: "Share the Secure Link",
    description:
      "Send the generated link or QR code to the intended recipient.",
    icon: "link" as IconName,
  },
];

const recipientSteps = [
  {
    title: "Open the Link",
    description:
      "The recipient opens the secure TrustLedger link or scans the QR code.",
  },
  {
    title: "Verify Access",
    description:
      "TrustLedger validates the link status, expiry date, and remaining access limit.",
  },
  {
    title: "Review the Statement",
    description:
      "The recipient can securely verify and download the authorized statement.",
  },
];

const securityControls = [
  "Customer-controlled statement sharing",
  "Time-limited access links",
  "Configurable download limits",
  "Secure identity verification",
  "Protected statement delivery",
  "Traceable access activity",
];

export default function ProcessAndGuidelinePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
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
                Secure Statement Sharing
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a]"
          >
            <Icon name="back" className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-green-100 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(74,222,128,0.14),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 sm:py-18">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-[#278b36]">
            <Icon name="shield" className="h-4 w-4" />
            Process and Guidelines
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            How TrustLedger Works
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            TrustLedger allows customers to securely share financial statements
            with authorized organizations through a controlled, traceable, and
            time-limited process.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a]"
            >
              <Icon name="user" />
              Create Customer Account
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-[#39aa43] bg-white px-6 py-3.5 text-sm font-bold text-[#29953a] transition hover:bg-[#f1fbf3]"
            >
              Customer Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
            Customer Journey
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Share a statement in four simple steps
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            The customer remains in control of the statement period, expiry
            date, and permitted number of downloads.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {customerSteps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
                  <Icon name={step.icon} className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#39aa43]">
                    Step {step.number}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-green-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8ec] text-[#29953a]">
                <Icon name="building" className="h-7 w-7" />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#29953a]">
                Recipient Experience
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                How banks and organizations access statements
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Authorized recipients do not need access to the customer
                dashboard. They use the secure link provided by the customer to
                verify and download the statement.
              </p>
            </div>

            <div className="space-y-4">
              {recipientSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-[#fbfdfb] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#39aa43] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">{step.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-green-100 bg-[#f1fbf3] p-7 sm:p-8">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-[#29953a]">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">Security Controls</h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              TrustLedger uses controlled access features to reduce unauthorized
              statement exposure and provide customers with visibility over
              sharing activity.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {securityControls.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white px-4 py-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7faea] text-[#29953a]">
                    <Icon name="check" className="h-4 w-4" />
                  </div>

                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#eaf8ec] text-[#29953a]">
              <Icon name="download" className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Important Sharing Guidelines
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Share links only with the intended recipient.",
                "Use an expiry date appropriate for the business requirement.",
                "Set the lowest practical download limit.",
                "Do not post statement links publicly or in open group chats.",
                "Revoke access when the recipient no longer requires the statement.",
                "Review shared-link activity regularly from your dashboard.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7faea] text-[#29953a]">
                    <Icon name="check" className="h-4 w-4" />
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-green-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="rounded-3xl bg-[#39aa43] p-7 text-white shadow-[0_16px_40px_rgba(57,170,67,0.20)] sm:flex sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icon name="support" className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Need assistance?</h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50">
                  Contact the TrustLedger support team for help with
                  registration, statement sharing, recipient access, or account
                  security.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#29953a] transition hover:bg-green-50 sm:mt-0"
            >
              Access Your Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 TrustLedger. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-[#29953a]">
              Home
            </Link>

            <Link href="/login" className="transition hover:text-[#29953a]">
              Login
            </Link>

            <Link
              href="/register"
              className="transition hover:text-[#29953a]"
            >
              Registration
            </Link>

            <Link
              href="/corp-register"
              className="transition hover:text-[#29953a]"
            >
              Organization
            </Link>
          </div>

          <div className="flex items-center gap-2 font-semibold text-[#278b36]">
            <Icon name="shield" className="h-5 w-5" />
            Secure. Transparent. Trustworthy.
          </div>
        </div>
      </footer>
    </main>
  );
}