import Link from "next/link";

export default function Home() {

  const kycUrl =   process.env.NEXT_PUBLIC_KYC_URL || "http://localhost:4000";

  console.log(process.env);

  const sections = [
    {
      title: "Login",
      href: "/login",
      desc: "Access your dashboard",
      icon: "🔐",
    },
    {
      title: "Registration",
      href: kycUrl,
      desc: "Create individual account",
      icon: "👤",
    },
    {
      title: "Corporate",
      href: "/corp-register",
      desc: "Register organization",
      icon: "🏢",
    },
    {
      title: "Guidelines",
      href: "/process-and-guideline",
      desc: "Read process & help",
      icon: "📘",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">
            TrustLedger
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Securely Share. Instantly Verify.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>

              <h2 className="text-lg font-semibold text-zinc-900">
                {item.title}
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                {item.desc}
              </p>

              <div className="mt-4 text-sm font-medium text-indigo-600">
                Continue →
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-zinc-500">
          © 2026 TrustLedger
        </div>
      </div>
    </main>
  );
}