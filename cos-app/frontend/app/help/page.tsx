export default function Help() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              Digital Microcredit & KYC Platform
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Help
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
              Complete customer profile collection, identity verification,
              microcredit information capture and application submission from
              one secure platform.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/help"
                className="rounded-lg bg-green-600 px-7 py-4 text-center font-semibold text-white shadow hover:bg-green-700"
              >
                01717403818
              </a>

              <a
                href="#"
                className="rounded-lg border border-slate-300 bg-white px-7 py-4 text-center font-semibold text-slate-700 hover:bg-slate-100"
              >
                help@cos.com
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Secure</h3>
                <p className="text-sm text-slate-500">Protected customer data</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">Simple</h3>
                <p className="text-sm text-slate-500">Easy application flow</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">Fast</h3>
                <p className="text-sm text-slate-500">Quick profile submission</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 rounded-2xl bg-green-50 p-6">
              <h2 className="mb-2 text-xl font-bold text-green-700">
                Application Process
              </h2>
              <p className="text-slate-600">
                Customers can complete their microcredit profile in a few steps.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Verify Identity
                  </h3>
                  <p className="text-sm text-slate-500">
                    Customer confirms personal and document information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Complete Profile
                  </h3>
                  <p className="text-sm text-slate-500">
                    Occupation, income, loan purpose and reference information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Submit Application
                  </h3>
                  <p className="text-sm text-slate-500">
                    Application is submitted for review and follow-up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}