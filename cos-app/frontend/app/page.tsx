import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50">
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Left Section */}
          <div>
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
              Secure Digital Onboarding
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Start Your Application
              <span className="mt-2 block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Quickly and Securely
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Apply for loan or brokerage services through a simple, secure and
              fully digital onboarding process.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/loan/onboard/abccp"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
              >
                Start Loan Application
              </Link>

              <Link
                href="/brokerage/onboard/abccp"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
              >
                Start Brokerage Application
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Easy Steps
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Online Access
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Digital Flow
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-green-200/50 to-emerald-100/40 blur-2xl" />

            <div className="relative rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
                    Why Choose Us
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Built for a Better Experience
                  </h2>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700 sm:flex">
                  ✓
                </div>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title: "Secure Application",
                    text: "Your information is handled through a protected onboarding process.",
                  },
                  {
                    title: "Simple Process",
                    text: "Complete your application with clear steps and minimal paperwork.",
                  },
                  {
                    title: "Fast Updates",
                    text: "Stay informed with timely updates throughout your application journey.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-green-200 hover:bg-green-50/40"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                        ✓
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="text-sm leading-6 text-slate-700">
                  Need assistance? Our support team is available to guide you
                  through the application process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}