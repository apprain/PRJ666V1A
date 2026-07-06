"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ProfileForm, { ProfileField } from "@/components/profile/ProfileForm";
import { saveBrokerageProfile } from "@/services/brokerage.service";

const brokerageFields: ProfileField[] = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "fatherName", label: "Father Name", type: "text", required: true },
  { name: "motherName", label: "Mother Name", type: "text" },
  { name: "occupation", label: "Occupation", type: "text", required: true },
  { name: "boType", label: "BO Type", type: "text", required: true },
  { name: "tradingAccountType", label: "Trading Account Type", type: "text" },
  { name: "bankName", label: "Bank Name", type: "text", required: true },
  { name: "accountNumber", label: "Account Number", type: "text", required: true },
  { name: "routingNumber", label: "Routing Number", type: "text" },
  { name: "nomineeName", label: "Nominee Name", type: "text" },
  { name: "nomineeRelation", label: "Nominee Relation", type: "text" },
  { name: "nomineeMobile", label: "Nominee Mobile", type: "text" },
  { name: "riskProfile", label: "Risk Profile", type: "text" },
  { name: "fatcaDeclaration", label: "FATCA Declaration", type: "text" },
];

export default function BrokerageProfileCompletePage() {
  const params = useParams();
  const router = useRouter();

  const leadId = params.leadId as string;

  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(name: string, value: any) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    try {
      await saveBrokerageProfile(leadId, values);
      router.push(`/brokerage/success?leadId=${leadId}`);
    } catch (error: any) {
      setMessage(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfileForm
      title="Brokerage Profile"
      subtitle="Complete the information required to open your brokerage account."
      fields={brokerageFields}
      values={values}
      loading={loading}
      message={message}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}