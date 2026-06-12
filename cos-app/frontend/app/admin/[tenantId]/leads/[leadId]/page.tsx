"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;  //  ; "http://localhost:3004";

export default function LeadDetailPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const leadId = params.leadId as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lead, setLead] = useState<any>(null);
  const [extraData, setExtraData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [kycData, setKycData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const tenant = localStorage.getItem("tenant_id");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    if (tenant !== tenantId) {
      window.location.href = `/admin/${tenant}/leads`;
      return;
    }

    async function loadLead() {
      const res = await fetch(`${API_URL}/api/leads/${leadId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const data = await res.json();

      const kycRes = await fetch(`${API_URL}/api/leads/${leadId}/kyc-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const kyc = await kycRes.json();

      if (kycRes.ok) {
        setKycData(kyc);
      }

      setLead(data.lead);
      setExtraData(data.extraData?.data || null);
      setLoading(false);
    }

    loadLead();
  }, [leadId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading lead...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow">
        <a href={`/admin/${tenantId}/leads`} className="text-sm text-blue-600">
          ← Back to Leads
        </a>

        <h1 className="mt-4 text-3xl font-bold">Lead Details</h1>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">KYC Images</h2>

          {kycData ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ImageCard
                title="Selfie"
                src={kycData.selfieImageUrl}
                onClick={() => setSelectedImage(kycData.selfieImageUrl)}
              />

              <ImageCard
                title="Document Front"
                src={kycData.frontImageUrl}
                onClick={() => setSelectedImage(kycData.frontImageUrl)}
              />

              <ImageCard
                title="Document Back"
                src={kycData.backImageUrl}
                onClick={() => setSelectedImage(kycData.backImageUrl)}
              />
            </div>
          ) : (
            <p className="rounded bg-yellow-50 p-4 text-sm">
              No KYC images found.
            </p>
          )}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Info label="Mobile" value={lead?.mobileNo} />
          <Info label="Full Name" value={lead?.fullName} />
          <Info label="Document Number" value={lead?.documentNumber} />
          <Info label="Date of Birth" value={lead?.dateOfBirth} />
          <Info label="KYC Status" value={lead?.kycStatus} />
          <Info label="Lead Status" value={lead?.leadStatus} />
          <Info label="Face Match Status" value={lead?.faceMatchStatus} />
          <Info
            label="Face Match Score"
            value={
              lead?.faceMatchScore != null
                ? `${Number(lead.faceMatchScore).toFixed(2)}%`
                : "-"
            }
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Microcredit Information
          </h2>

          {extraData ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Info label="Occupation" value={extraData.occupation} />
              <Info
                label="Employer / Business"
                value={extraData.employerName}
              />
              <Info label="Monthly Income" value={extraData.monthlyIncome} />
              <Info label="Loan Amount" value={extraData.loanAmount} />
              <Info label="Loan Purpose" value={extraData.loanPurpose} />
              <Info label="Current Address" value={extraData.currentAddress} />
              <Info label="Reference Name" value={extraData.referenceName} />
              <Info
                label="Reference Mobile"
                value={extraData.referenceMobile}
              />
            </div>
          ) : (
            <p className="rounded bg-yellow-50 p-4 text-sm">
              No extra information submitted yet.
            </p>
          )}
        </section>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-h-[90vh] max-w-5xl rounded bg-white p-3">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[85vh] max-w-full rounded object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value || "-"}</p>
    </div>
  );
}

function ImageCard({
  title,
  src,
  onClick,
}: {
  title: string;
  src: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">{title}</p>

      {src ? (
        <img
          src={src}
          alt={title}
          onClick={onClick}
          className="h-48 w-full cursor-pointer rounded border object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center rounded border bg-white text-sm text-gray-400">
          No image
        </div>
      )}
    </div>
  );
}
