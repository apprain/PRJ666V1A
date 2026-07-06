"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import MobileStep from "@/components/onboarding/MobileStep";
import OtpStep from "@/components/onboarding/OtpStep";
import { startBrokerage } from "@/services/brokerage.service";
import { sendOtp, verifyOtp } from "@/services/otp.service";
import { markOtpVerified } from "@/services/lead.service";
import { startKyc } from "@/services/kyc.service";

type Step = "mobile" | "otp";

export default function BrokerageOnboardPage() {
  const params = useParams();
  //const router = useRouter();

  const tenantSlug = params.tenantSlug as string;

  const [step, setStep] = useState<Step>("mobile");
  const [leadId, setLeadId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleStartBrokerage() {
    if (!mobileNo) {
      setMessage("Please enter mobile number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await startBrokerage(tenantSlug, mobileNo);

      const newLeadId = data.lead.id;

      localStorage.setItem("brokerageLeadId", newLeadId);
      localStorage.setItem("brokerageMobileNo", mobileNo);

      setLeadId(newLeadId);

      const response =  await sendOtp(mobileNo);
      console.log(response);
      setMessage("OTP sent successfully. DevOTP : " + response.devOtp);

      setStep("otp");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await verifyOtp(mobileNo, otp);

      await markOtpVerified(leadId);

      const kycData = await startKyc(leadId);
      window.location.href = kycData.verificationUrl;
      
    } catch (error: any) {
      setMessage(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <OtpStep
        title="Verify Mobile Number"
        subtitle={`Enter the OTP sent to ${mobileNo}`}
        otp={otp}
        loading={loading}
        message={message}
        onOtpChange={setOtp}
        onVerify={handleVerifyOtp}
        onBack={() => setStep("mobile")}
      />
    );
  }

  return (
    <MobileStep
      title="Brokerage Account Opening"
      subtitle="Start your digital brokerage onboarding."
      mobileNo={mobileNo}
      loading={loading}
      message={message}
      onMobileChange={setMobileNo}
      onSubmit={handleStartBrokerage}
    />
  );
}
