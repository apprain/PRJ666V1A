"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function ShareStatementPage() {
  const router = useRouter();

  const [link, setLink] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attemptsRemain, setAttemptsRemain] = useState("10");
  
  const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const generateLink = async () => {
    try {
      const response = await fetch(
        serviceUrl + "/statement-shares",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            bankName,
            accountNumber,
            startDate,
            endDate,
            attemptsRemain,
            expireDate
          }),
        }
      );

      const data = await response.json();
      setLink(data.shareLink);
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Failed to generate share link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Share Bank Statement
        </h1>

        <p className="mb-6 text-gray-600">
          Generate a secure link for an external party to verify and download
          your bank statement.
        </p>

        <div className="space-y-5">
          {/* Bank */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Bank
            </label>

            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="">Select Bank</option>
              <option value="RBC">RBC</option>
              <option value="TD">TD</option>
              <option value="Scotiabank">Scotiabank</option>
              <option value="CIBC">CIBC</option>
              <option value="BMO">BMO</option>
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Account Number
            </label>

            <input
              type="text"
              maxLength={13}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>
          </div>

          {/* Expire */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Expire Date
              </label>

              <input
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Number of Downloads
              </label>

            <select
              value={attemptsRemain}
              onChange={(e) => setAttemptsRemain(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3"
              >
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
               <option value="10">20</option>
            </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateLink}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Generate Secure Share Link
          </button>

          {/* Generated Link */}
          {link && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 font-medium text-gray-700">
                Generated Link
              </p>

              <input
                readOnly
                value={link}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
              />

              {/* Copy Button */}
              <button
                  onClick={async () => {
                    if (navigator.clipboard) {
                      await navigator.clipboard.writeText(link);
                      alert("Link copied");
                    } else {
                      const textArea = document.createElement("textarea");
                      textArea.value = link;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      alert("Link copied");
                    }
                  }}
                className="mt-3 w-full rounded-lg bg-gray-800 p-3 text-white transition hover:bg-black"
              >
                Copy Link
              </button>

              {/* QR Code */}
              <div className="mt-6 flex flex-col items-center">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Scan QR Code
                </p>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <QRCode value={link} size={180} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}