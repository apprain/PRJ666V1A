import Link from "next/link";

type IconName =
  | "login"
  | "register"
  | "corporate"
  | "guidelines"
  | "shield"
  | "check"
  | "support"
  | "lock"
  | "document";

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "login":
      return (
        <svg {...props}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
        </svg>
      );

    case "register":
      return (
        <svg {...props}>
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21a6 6 0 0 1 12 0" />
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      );

    case "corporate":
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

    case "guidelines":
    case "document":
      return (
        <svg {...props}>
          <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
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

    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
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

const benefits = [
  {
    title: "Secure Statement Sharing",
    description:
      "Your financial information is protected throughout the sharing process.",
  },
  {
    title: "Simple Customer Journey",
    description:
      "Login, provide consent, and share statements through clear guided steps.",
  },
  {
    title: "Instant Verification",
    description:
      "Authorized institutions can securely verify shared statement information.",
  },
];

const trustItems = [
  {
    title: "Protected Access",
    description: "Secure customer authentication",
    icon: "lock" as IconName,
  },
  {
    title: "Customer Controlled",
    description: "Consent-based statement sharing",
    icon: "shield" as IconName,
  },
  {
    title: "Verified Documents",
    description: "Trusted financial information",
    icon: "document" as IconName,
  },
  {
    title: "Auditable Activity",
    description: "Traceable platform actions",
    icon: "guidelines" as IconName,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfdfb] text-[#101828]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2fa642] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-xl font-bold tracking-tight text-[#101828] sm:text-2xl">
                TrustLedger
              </span>

              <span className="hidden text-sm text-slate-500 md:block">
                Securely Share. Instantly Verify.
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/process-and-guideline"
              className="hidden items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-[#29953a] md:flex"
            >
              <Icon name="support" className="h-5 w-5" />
              Help & Support
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-[#38a84a] bg-white px-4 py-2.5 text-sm font-semibold text-[#268b36] transition hover:bg-[#f1fbf3]"
            >
              <Icon name="login" className="h-5 w-5" />
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(74,222,128,0.14),transparent_33%)]" />
        <div className="absolute -left-28 top-44 h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-16">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-[#278b36] shadow-sm">
              Secure Financial Statement Sharing
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.04] tracking-tight text-[#101828] sm:text-6xl">
              Share Your Financial Statements
              <span className="mt-2 block text-[#3caf4b]">
                Quickly and Securely
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              TrustLedger gives customers a simple and secure way to share
              verified financial statements with authorized banks and
              institutions.
            </p>

            {/* Primary customer actions */}
            <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              <Link
                href="/login"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#39aa43] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.22)] transition hover:bg-[#31993a]"
              >
                <Icon name="login" className="h-5 w-5" />
                Customer Login
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/register"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#39aa43] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.22)] transition hover:bg-[#31993a]"
              >
                <Icon name="register" className="h-5 w-5" />
                Create Customer Account
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Secondary actions */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link
                href="/corp-register"
                className="inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#29953a]"
              >
                <Icon name="corporate" className="h-4 w-4" />
                Organization Registration
              </Link>
              
              <Link
                href="/corp-login"
                className="inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#29953a]"
              >
                <Icon name="guidelines" className="h-4 w-4" />
                Organization Login
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
              {[
                {
                  value: "3",
                  label: "Easy Steps",
                },
                {
                  value: "24/7",
                  label: "Online Access",
                },
                {
                  value: "100%",
                  label: "Digital Flow",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#101828] sm:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 sm:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(16,24,40,0.08)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#2c9c3c]">
                  Why choose us
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101828] sm:text-3xl">
                  Built for a Better Experience
                </h2>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f9eb] text-[#269437]">
                <Icon name="check" className="h-8 w-8" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-[#fcfdfc] p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7faea] text-[#29953a]">
                    <Icon name="check" className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#101828]">{item.title}</h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4 rounded-2xl border border-green-100 bg-[#f1fbf3] p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#29953a]">
                <Icon name="support" className="h-6 w-6" />
              </div>

              <p className="text-sm leading-6 text-slate-700">
                Need assistance? Our support team is available to guide you
                through the statement-sharing process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm">
          <p className="text-center text-sm font-bold uppercase tracking-wide text-[#2d9c3d]">
            Trusted and Secure Platform
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-center gap-4 ${
                  index !== trustItems.length - 1
                    ? "lg:border-r lg:border-slate-200"
                    : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf9ef] text-[#2d9c3d]">
                  <Icon name={item.icon} className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#101828]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 text-sm text-slate-500 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>© 2026 TrustLedger. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/process-and-guideline"
              className="transition hover:text-[#29953a]"
            >
              Guidelines
            </Link>

            <Link href="/register" className="transition hover:text-[#29953a]">
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
