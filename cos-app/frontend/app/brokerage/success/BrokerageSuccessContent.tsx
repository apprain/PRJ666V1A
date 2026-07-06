"use client";

import { useSearchParams, useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function BrokerageSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const leadId = searchParams.get("leadId");

  return (
    <OnboardingLayout
      title="Application Submitted"
      subtitle="Your brokerage account opening request has been submitted successfully."
      badge="Submission complete"
    >
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Thank you. Your application is under review.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Our operations team will review your submitted information and KYC
          details. You may be contacted if any additional information is needed.
        </p>

        {leadId && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Application ID
            </p>
            <p className="mt-1 break-all font-semibold text-slate-900">
              {leadId}
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/brokerage/onboard/demo")}
          className="mt-7 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-green-700 hover:to-green-800"
        >
          Start New Application
        </button>

        <button
          onClick={() => router.push("/")}
          className="mt-7 ml-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-green-700 hover:to-green-800"
        >
          Back to Home
        </button>
      </div>
    </OnboardingLayout>
  );
}