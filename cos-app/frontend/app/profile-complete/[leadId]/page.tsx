"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = "http://localhost:3004";

export default function ProfileCompletePage() {
  const params = useParams();
  const leadId = params.leadId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    documentNumber: "",
    dateOfBirth: "",
    address: "",

    occupation: "",
    employerName: "",
    monthlyIncome: "",
    loanAmount: "",
    loanPurpose: "",
    currentAddress: "",
    referenceRelation: "",
    referenceName: "",
    referenceMobile: "",
  });

  useEffect(() => {
    async function loadLead() {
      const res = await fetch(`${API_URL}/api/leads/${leadId}`);
      const data = await res.json();

      const lead = data.lead;
      const extra = data.extraData?.data || {};

      setForm({
        fullName: lead?.fullName || "",
        documentNumber: lead?.documentNumber || "",
        dateOfBirth: lead?.dateOfBirth || "",
        address: lead?.address || "",

        occupation: extra.occupation || "",
        employerName: extra.employerName || "",
        monthlyIncome: extra.monthlyIncome || "",
        loanAmount: extra.loanAmount || "",
        loanPurpose: extra.loanPurpose || "",
        currentAddress: extra.currentAddress || lead?.address || "",
        referenceRelation: extra.referenceRelation || "",
        referenceName: extra.referenceName || "",
        referenceMobile: extra.referenceMobile || "",
      });

      setLoading(false);
    }

    loadLead();
  }, [leadId]);

  const fieldClass = (field: string) =>
    `w-full rounded border p-3 ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
    }`;

  const errorText = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
    ) : null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // KYC Information
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!form.documentNumber.trim()) {
      newErrors.documentNumber = "Document Number is required.";
    }

    if (!form.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required.";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Microcredit Information
    // if (!form.occupation) {
    //   newErrors.occupation = "Occupation is required.";
    // }

    if (!form.monthlyIncome) {
      newErrors.monthlyIncome = "Monthly Income is required.";
    }

    if (!form.loanAmount) {
      newErrors.loanAmount = "Loan Amount is required.";
    }

    if (!form.loanPurpose) {
      newErrors.loanPurpose = "Purpose of Loan is required.";
    }

    // if (!form.currentAddress.trim()) {
    //   newErrors.currentAddress = "Current Address is required.";
    // }

    if (!form.referenceName.trim()) {
      newErrors.referenceName = "Reference Name is required.";
    }

    if (!form.referenceRelation) {
      newErrors.referenceRelation = "Reference Relationship is required.";
    }

    if (!form.referenceMobile.trim()) {
      newErrors.referenceMobile = "Reference Mobile Number is required.";
    } else if (!/^01\d{9}$/.test(form.referenceMobile)) {
      newErrors.referenceMobile = "Enter a valid mobile number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];

      setTimeout(() => {
        const element = document.getElementById(firstErrorField);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          (element as HTMLInputElement).focus();
        }
      }, 100);

      return false;
    }

    return true;

    // return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const submitProfile = async () => {
    if (!validateForm()) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}/extra-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save profile");
        return;
      }

      window.history.replaceState(null, "", "/application-submitted");
      setSubmitted(true);

      setMessage(
        "Thank you for submitting your application. We have successfully received your information. One of our representatives will review your application and contact you shortly regarding the next steps.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded bg-white p-6 shadow">Loading profile...</div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl text-green-600">✓</div>

          <h1 className="mb-3 text-2xl font-bold text-green-700">
            Application Submitted Successfully
          </h1>

          <p className="mb-6 text-gray-600">
            Thank you for submitting your application. We have successfully
            received your information.
          </p>

          <p className="mb-8 text-gray-600">
            One of our representatives will review your application and contact
            you shortly regarding the next steps.
          </p>

          <button
            onClick={() => {
              window.location.replace("/");
            }}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-center text-2xl font-bold text-green-700">
          Complete Your Profile
        </h1>

        {message && (
          <div
            className={`mt-4 rounded p-3 text-center text-sm ${
              Object.keys(errors).length > 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Confirm Your Information
            </h2>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter full name"
                className={fieldClass("fullName")}
              />
              {errorText("fullName")}
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Document Number <span className="text-red-500">*</span>
              </label>
              <input
                id="documentNumber"
                value={form.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                placeholder="Enter document number"
                className={fieldClass("documentNumber")}
              />
              {errorText("documentNumber")}
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                placeholder="Enter date of birth"
                className={fieldClass("dateOfBirth")}
              />
              {errorText("dateOfBirth")}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter address"
                className={fieldClass("address")}
                rows={3}
              />
              {errorText("address")}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              credit Information
            </h2>
{/* 
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Occupation <span className="text-red-500">*</span>
              </label>
              <select
                id="occupation"
                value={form.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                className={fieldClass("occupation")}
              >
                <option value="">Select Occupation</option>
                <option value="Farmer">Farmer</option>
                <option value="Small Business Owner">
                  Small Business Owner
                </option>
                <option value="Shopkeeper">Shopkeeper</option>
                <option value="Tailor">Tailor</option>
                <option value="Teacher">Teacher</option>
                <option value="Driver">Driver</option>
                <option value="Housewife">Housewife</option>
                <option value="Daily Laborer">Daily Laborer</option>
                <option value="Service Holder">Service Holder</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
              {errorText("occupation")}
            </div> */}
{/* 
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Employer / Business Name
              </label>
              <input
                id="employerName"
                value={form.employerName}
                onChange={(e) => handleChange("employerName", e.target.value)}
                placeholder="Enter employer or business name"
                className={fieldClass("employerName")}
              />
              {errorText("employerName")}
            </div> */}

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Monthly Income <span className="text-red-500">*</span>
              </label>
              <select
                id="monthlyIncome"
                value={form.monthlyIncome}
                onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                className={fieldClass("monthlyIncome")}
              >
                <option value="">Select Monthly Income</option>
                <option value="Below 10,000">Below 10,000</option>
                <option value="10,000 - 20,000">10,000 - 20,000</option>
                <option value="20,001 - 30,000">20,001 - 30,000</option>
                <option value="30,001 - 50,000">30,001 - 50,000</option>
                <option value="50,001 - 100,000">50,001 - 100,000</option>
                <option value="Above 100,000">Above 100,000</option>
              </select>
              {errorText("monthlyIncome")}
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Loan Amount Requested <span className="text-red-500">*</span>
              </label>
              <select
                id="loanAmount"
                value={form.loanAmount}
                onChange={(e) => handleChange("loanAmount", e.target.value)}
                className={fieldClass("loanAmount")}
              >
                <option value="">Select Loan Amount</option>
                <option value="5000">5,000</option>
                <option value="10000">10,000</option>
                <option value="20000">20,000</option>
                <option value="30000">30,000</option>
                <option value="50000">50,000</option>
                <option value="100000">100,000</option>
                <option value="Other">Other</option>
              </select>
              {errorText("loanAmount")}
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Purpose of Loan <span className="text-red-500">*</span>
              </label>
              <select
                id="loanPurpose"
                value={form.loanPurpose}
                onChange={(e) => handleChange("loanPurpose", e.target.value)}
                className={fieldClass("loanPurpose")}
              >
                <option value="">Select Purpose</option>
                <option value="Business Expansion">Business Expansion</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Livestock">Livestock</option>
                <option value="Education">Education</option>
                <option value="Medical Treatment">Medical Treatment</option>
                <option value="Home Improvement">Home Improvement</option>
                <option value="Equipment Purchase">Equipment Purchase</option>
                <option value="Emergency Needs">Emergency Needs</option>
                <option value="Other">Other</option>
              </select>
              {errorText("loanPurpose")}
            </div>

            {/* <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Current Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="currentAddress"
                value={form.currentAddress}
                onChange={(e) => handleChange("currentAddress", e.target.value)}
                placeholder="Enter current address"
                className={fieldClass("currentAddress")}
                rows={3}
              />
              {errorText("currentAddress")}
            </div> */}

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Reference Person Name <span className="text-red-500">*</span>
              </label>
              <input
                id="referenceName"
                value={form.referenceName}
                onChange={(e) => handleChange("referenceName", e.target.value)}
                placeholder="Enter reference person name"
                className={fieldClass("referenceName")}
              />
              {errorText("referenceName")}
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">
                Reference Relationship <span className="text-red-500">*</span>
              </label>
              <select
                id="referenceRelation"
                value={form.referenceRelation}
                onChange={(e) =>
                  handleChange("referenceRelation", e.target.value)
                }
                className={fieldClass("referenceRelation")}
              >
                <option value="">Select Reference Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Relative">Relative</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Friend">Friend</option>
                <option value="Employer">Employer</option>
              </select>
              {errorText("referenceRelation")}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Reference Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                id="referenceMobile"
                type="tel"
                value={form.referenceMobile}
                onChange={(e) =>
                  handleChange("referenceMobile", e.target.value)
                }
                placeholder="Enter reference mobile number"
                className={fieldClass("referenceMobile")}
              />
              {errorText("referenceMobile")}
            </div>
          </section>

          <button
            type="button"
            onClick={submitProfile}
            disabled={saving || submitted}
            className="w-full rounded bg-green-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Submitting..." : "Submit Profile"}
          </button>
        </div>
      </div>
    </main>
  );
}
