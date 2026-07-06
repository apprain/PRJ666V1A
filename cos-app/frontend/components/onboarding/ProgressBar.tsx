"use client";

type Step = {
  label: string;
  key: string;
};

type ProgressBarProps = {
  currentStep: string;
};

const steps: Step[] = [
  { key: "mobile", label: "Mobile" },
  { key: "otp", label: "OTP" },
  { key: "identity", label: "Identity" },
  { key: "profile", label: "Profile" },
  { key: "complete", label: "Complete" },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="mb-6 grid grid-cols-5 gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="text-center">
            <div
              className={[
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                isCompleted
                  ? "bg-green-600 text-white"
                  : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500",
              ].join(" ")}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            <p
              className={[
                "mt-2 text-xs font-medium",
                isActive ? "text-blue-700" : "text-slate-500",
              ].join(" ")}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
