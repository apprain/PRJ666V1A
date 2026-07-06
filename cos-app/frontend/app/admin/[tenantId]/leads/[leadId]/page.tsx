"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  }, [leadId, tenantId]);

  async function downloadKycPdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    function drawCard(
      label: string,
      value: any,
      x: number,
      y: number,
      w = 240,
      h = 46,
    ) {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        color: rgb(0.98, 0.98, 0.98),
      });

      page.drawText(label, {
        x: x + 10,
        y: y + h - 15,
        size: 7,
        font,
        color: rgb(0.35, 0.35, 0.45),
      });

      const text = String(value || "-");

      page.drawText(text.length > 34 ? text.substring(0, 34) + "..." : text, {
        x: x + 10,
        y: y + 12,
        size: 8,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    }

    async function addImageCard(
      url: string,
      x: number,
      y: number,
      title: string,
    ) {
      page.drawRectangle({
        x,
        y,
        width: 155,
        height: 120,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        color: rgb(0.98, 0.98, 0.98),
      });

      page.drawText(title, {
        x: x + 8,
        y: y + 104,
        size: 8,
        font: boldFont,
      });

      if (!url) return;

      try {
        const res = await fetch(url);
        const imageBytes = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") || "";

        const image =
          contentType.includes("png") || url.toLowerCase().includes(".png")
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        page.drawImage(image, {
          x: x + 8,
          y: y + 10,
          width: 139,
          height: 85,
        });
      } catch {
        page.drawText("Image unavailable", {
          x: x + 25,
          y: y + 50,
          size: 8,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    }

    let y = 800;

    page.drawText("KYC Verification", {
      x: 40,
      y,
      size: 22,
      font: boldFont,
    });

    y -= 35;

    page.drawText("KYC Images", {
      x: 40,
      y,
      size: 13,
      font: boldFont,
    });

    y -= 130;

    await addImageCard(kycData?.selfieImageUrl, 40, y, "Selfie");
    await addImageCard(kycData?.frontImageUrl, 220, y, "Document Front");
    await addImageCard(kycData?.backImageUrl, 400, y, "Document Back");

    y -= 65;

    drawCard("Mobile", lead?.mobileNo, 40, y);
    drawCard("Full Name", lead?.fullName, 315, y);

    y -= 55;
    drawCard("Document Number", lead?.documentNumber, 40, y);
    drawCard("Date of Birth", lead?.dateOfBirth, 315, y);

    y -= 55;
    drawCard("KYC Status", lead?.kycStatus, 40, y);
    drawCard("Lead Status", lead?.leadStatus, 315, y);

    y -= 55;
    drawCard("Face Match Status", lead?.faceMatchStatus, 40, y);
    drawCard(
      "Face Match Score",
      lead?.faceMatchScore != null
        ? `${Number(lead.faceMatchScore).toFixed(2)}%`
        : "-",
      315,
      y,
    );

    y -= 55;

    page.drawText("Microcredit Information", {
      x: 40,
      y,
      size: 13,
      font: boldFont,
    });

    y -= 50;

    drawCard("Occupation", extraData?.occupation, 40, y);
    drawCard("Employer / Business", extraData?.employerName, 315, y);

    y -= 55;
    drawCard("Monthly Income", extraData?.monthlyIncome, 40, y);
    drawCard("Loan Amount", extraData?.loanAmount, 315, y);

    y -= 55;
    drawCard("Loan Purpose", extraData?.loanPurpose, 40, y);
    drawCard("Current Address", extraData?.currentAddress, 315, y);

    y -= 55;
    drawCard("Reference Name", extraData?.referenceName, 40, y);
    drawCard("Reference Mobile", extraData?.referenceMobile, 315, y);

    page.drawText("Generated by Apprain KYC", {
      x: 40,
      y: 35,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // const pdfBytes = await pdfDoc.save();

    // saveAs(
    //   new Blob([pdfBytes], { type: "application/pdf" }),
    //   `KYC_Verification_${leadId}.pdf`,
    // );
    const pdfBytes = await pdfDoc.save();

    const pdfBlob = new Blob([pdfBytes.slice().buffer], {
      type: "application/pdf",
    });

    saveAs(pdfBlob, `KYC_Verification_${leadId}.pdf`);
  }

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
          ← Back to Loan Applications
        </a>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Loan Application Details</h1>

          <button
            onClick={downloadKycPdf}
            className="rounded bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Download PDF
          </button>
        </div>

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
