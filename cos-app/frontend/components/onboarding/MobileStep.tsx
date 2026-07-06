"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageLayout from "@/components/ui/PageLayout";
import StatusMessage from "@/components/onboarding/StatusMessage";

type MobileStepProps = {
  title: string;
  subtitle: string;
  mobileNo: string;
  loading: boolean;
  message?: string;
  onMobileChange: (value: string) => void;
  onSubmit: () => void;
};

export default function MobileStep({
  title,
  subtitle,
  mobileNo,
  loading,
  message,
  onMobileChange,
  onSubmit,
}: MobileStepProps) {
  return (
    <PageLayout>
      <Card>
        <div className="mb-6">
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-green-700">
            Secure onboarding
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>

        <Input
          label="Mobile Number"
          value={mobileNo}
          onChange={onMobileChange}
          placeholder="Enter mobile number"
          required
        />

        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Please wait..." : "Start Application"}
        </Button>

        <StatusMessage message={message} type="info" />
      </Card>
    </PageLayout>
  );
}
