import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Left Side */}
          <div>
         


            <div className="space-y-3">
              <div className="space-y-3">
                <Link
                  href="/onboard/abccp"
                  className="block rounded-xl bg-green-600 px-6 py-4 text-center font-semibold text-white shadow hover:bg-green-700"
                >
                  ABC Credit Program
                </Link>

              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Why Choose Us?
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Secure Process
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your information is protected throughout the application.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Simple Application
                  </h3>

                  <p className="text-sm text-slate-500">
                    Easy-to-follow steps with minimal paperwork.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Faster Decisions
                  </h3>

                  <p className="text-sm text-slate-500">
                    Submit your application online and receive updates quickly.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-600">
                  Need assistance? Our support team is ready to help you
                  complete your application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
