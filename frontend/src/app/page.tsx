import Link from "next/link";

export default function Home() {
  const sections = [
    {
      title: "Individual Login",
      href: "/login",
      desc: "Login to your individual account.",
    },
    {
      title: "Individual Registration",
      href: "http://localhost:4000/",
      desc: "Create a new individual account.",
    },
    {
      title: "Certifier Login",
      href: "/certifier/login",
      desc: "Login as a certifier.",
    },
    {
      title: "Certifier Registration",
      href: "/certifier/register",
      desc: "Register as a certifier.",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">
            TrustLedger
          </h1>
          <p className="mt-3 text-zinc-600">
            Securely Share. Instantly Verify.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 transition hover:shadow-md hover:border-zinc-300"
            >
              <h2 className="text-xl font-semibold text-zinc-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-600">{item.desc}</p>

              <div className="mt-6 text-sm font-medium text-indigo-600">
                Continue →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}