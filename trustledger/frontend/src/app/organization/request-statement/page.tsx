"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "shield" | "upload" | "file" | "close" | "check" | "warning";
  className?: string;
}) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "upload") {
    return (
      <svg {...props}>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  if (name === "file") {
    return (
      <svg {...props}>
        <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="M14 2v6h6" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg {...props}>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "warning") {
    return (
      <svg {...props}>
        <path d="M10.3 3.6 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RequestStatementPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [sourceBankName, setSourceBankName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [consentDocument, setConsentDocument] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType");

    if (!token || accountType !== "corporate") {
      router.replace("/corp-login");
    }
  }, [router]);

  function validateConsentFile(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Only PDF, JPG, JPEG, and PNG files are allowed.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("The consent document must be 10 MB or smaller.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function selectConsentFile(file?: File) {
    if (file && validateConsentFile(file)) {
      setConsentDocument(file);
    }
  }

  function removeConsentFile() {
    setConsentDocument(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetForm() {
    setSourceBankName("");
    setCustomerName("");
    setCustomerMobile("");
    setAccountNumber("");
    setStartDate("");
    setEndDate("");
    setPurpose("");
    setNotes("");
    setExpiresAt("");
    removeConsentFile();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!consentDocument) {
      setErrorMessage("Please upload the signed customer consent document.");
      return;
    }

    if (startDate > endDate) {
      setErrorMessage("The end date must be after the start date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(expiresAt);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      setErrorMessage("Please select a valid expiry date.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/corp-login");
      return;
    }

    const formData = new FormData();
    formData.append("sourceBankName", sourceBankName);
    formData.append("customerName", customerName.trim());
    formData.append("customerMobile", customerMobile.trim());
    formData.append("accountNumber", accountNumber.trim());
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("purpose", purpose);
    formData.append("expiresAt", expiresAt);
    formData.append("consentDocument", consentDocument);

    if (notes.trim()) {
      formData.append("notes", notes.trim());
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${serviceUrl.replace(/\/$/, "")}/statement-requests`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      let data: { message?: string | string[] } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("accountType");
        localStorage.removeItem("organizationId");
        localStorage.removeItem("organizationName");
        router.replace("/corp-login");
        return;
      }

      if (!response.ok) {
        const serverMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;

        throw new Error(
          serverMessage || "Unable to submit the statement request.",
        );
      }

      
      router.replace("/organization/statement-requests");
      //setSuccessMessage("Statement request submitted successfully.");
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit the statement request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/organization/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>
              <div className="text-xs text-slate-500">Organization Portal</div>
            </div>
          </Link>

          <Link
            href="/organization/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#278b36]">
            <Icon name="shield" className="h-4 w-4" />
            Secure bank-to-bank request
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Request a Bank Statement
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Submit a controlled statement request supported by the customer’s
            signed consent document.
          </p>
        </div>

        <form
          onSubmit={submitRequest}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 bg-[#fbfdfb] px-6 py-6 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
              Statement request
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Customer and request information
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Provide the customer details, statement period, request purpose,
              and signed authorization document.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="sourceBankName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source Bank
                </label>
                <select
                  id="sourceBankName"
                  value={sourceBankName}
                  onChange={(event) => setSourceBankName(event.target.value)}
                  className={inputClass}
                  disabled={submitting}
                  required
                >
                  <option value="">Select source bank</option>
                  <option value="City Bank PLC">City Bank PLC</option>
                  <option value="Dutch-Bangla Bank PLC">
                    Dutch-Bangla Bank PLC
                  </option>
                  <option value="BRAC Bank PLC">BRAC Bank PLC</option>
                  <option value="United Commercial Bank PLC">
                    United Commercial Bank PLC
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(event.target.value.replace(/\D/g, ""))
                  }
                  className={inputClass}
                  placeholder="Enter account number"
                  inputMode="numeric"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer Name
                </label>
                <input
                  id="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className={inputClass}
                  placeholder="Enter customer name"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customerMobile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer Mobile
                </label>
                <input
                  id="customerMobile"
                  value={customerMobile}
                  onChange={(event) => setCustomerMobile(event.target.value)}
                  className={inputClass}
                  placeholder="Enter customer mobile"
                  inputMode="tel"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="purpose"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Request Purpose
                </label>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  className={inputClass}
                  disabled={submitting}
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="Loan Assessment">Loan Assessment</option>
                  <option value="Mortgage Assessment">
                    Mortgage Assessment
                  </option>
                  <option value="Credit Review">Credit Review</option>
                  <option value="Income Verification">
                    Income Verification
                  </option>
                  <option value="Account Opening">Account Opening</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Request Expiry
                </label>
                <input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Statement Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Statement End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={inputClass}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Signed Consent Document
                </label>

                {!consentDocument ? (
                  <div
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setDragActive(true);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      setDragActive(false);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragActive(false);
                      selectConsentFile(event.dataTransfer.files?.[0]);
                    }}
                    className={`rounded-2xl border-2 border-dashed px-6 py-9 text-center transition ${
                      dragActive
                        ? "border-[#39aa43] bg-green-50"
                        : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
                      <Icon name="upload" className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-bold text-slate-800">
                      Upload customer consent
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Drag and drop a signed PDF, JPG, or PNG document here.
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={submitting}
                      className="mt-5 rounded-xl border border-[#39aa43] bg-white px-5 py-2.5 text-sm font-bold text-[#29953a] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Choose Document
                    </button>

                    <input
                      ref={fileInputRef}
                      id="consentDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(event) =>
                        selectConsentFile(event.target.files?.[0])
                      }
                      className="hidden"
                      disabled={submitting}
                    />

                    <p className="mt-3 text-xs text-slate-400">
                      Maximum file size: 10 MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#29953a]">
                        <Icon name="file" className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {consentDocument.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(consentDocument.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeConsentFile}
                      disabled={submitting}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      aria-label="Remove consent document"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Add any supporting information or processing instructions"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-green-100 bg-[#f1fbf3] px-5 py-4">
              <div className="flex items-start gap-3">
                <Icon
                  name="shield"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#29953a]"
                />
                <p className="text-sm leading-6 text-slate-600">
                  By submitting this request, the organization confirms that the
                  uploaded consent document authorizes the requested statement
                  access.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Icon name="shield" className="h-5 w-5" />
                  Submit Statement Request
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
