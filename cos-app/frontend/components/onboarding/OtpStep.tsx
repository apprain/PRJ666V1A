"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ProgressBar from "@/components/onboarding/ProgressBar";
import StatusMessage from "@/components/onboarding/StatusMessage";

type OtpStepProps = {
  title: string;
  subtitle: string;
  otp: string;
  loading: boolean;
  message?: string;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onBack?: () => void;
};

export default function OtpStep({
  title,
  subtitle,
  otp,
  loading,
  message,
  onOtpChange,
  onVerify,
  onBack,
}: OtpStepProps) {
  return (
    <OnboardingLayout
      title={title}
      subtitle={subtitle}
      badge="Mobile verification"
    >
      <ProgressBar currentStep="otp" />

      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          🔐 Enter the one-time verification code sent to your registered mobile
          number.
        </div>
      </div>

      <Input
        label="OTP Code"
        value={otp}
        onChange={onOtpChange}
        placeholder="Enter 6-digit OTP"
        required
      />

      <div className="mt-6">
        <Button onClick={onVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>

      {onBack && (
        <div className="mt-3">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-slate-500">
        Didn't receive the code?
        <button
          type="button"
          className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
        >
          Resend OTP
        </button>
      </div>

      <StatusMessage
        message={message}
        type={message?.toLowerCase().includes("error") ? "error" : "info"}
      />
    </OnboardingLayout>
  );
}
