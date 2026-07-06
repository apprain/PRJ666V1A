"use client";

type OnboardingLayoutProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
};

export default function OnboardingLayout({
  title,
  subtitle,
  badge = "Secure onboarding",
  children,
}: OnboardingLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-green-600 to-green-700 p-8 text-white shadow-lg">
          <div className="mb-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {badge}
          </div>

          <h1 className="text-3xl font-bold">{title}</h1>

          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
              {subtitle}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-green-50">
            <span>✓ Secure</span>
            <span>✓ Encrypted</span>
            <span>✓ Paperless</span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}