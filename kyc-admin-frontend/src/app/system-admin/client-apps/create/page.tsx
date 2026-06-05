"use client";

import { useState } from "react";

export default function CreateClientAppPage() {
  const [name, setName] = useState("");
  const [redirectUrls, setRedirectUrls] = useState(
    "https://localhost:3001/kyc/callback",
  );
  const [webhookUrl, setWebhookUrl] = useState(
    "https://localhost:3001/api/kyc/webhook",
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function createClientApp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("system_admin_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/client-apps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          allowedRedirectUrls: redirectUrls
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
          webhookUrl,
        }),
      },
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Failed to create client app");
      return;
    }

    setResult(data);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Create Client App</h1>

        <form onSubmit={createClientApp} className="space-y-4">
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Client App Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            className="h-28 w-full rounded-lg border p-3"
            placeholder="Allowed Redirect URLs, one per line"
            value={redirectUrls}
            onChange={(e) => setRedirectUrls(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />

          <button
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            {loading ? "Creating..." : "Create Client App"}
          </button>
        </form>

        {result && (
          <div className="mt-8 rounded-xl border bg-yellow-50 p-4">
            <h2 className="mb-3 text-xl font-bold">Client App Created</h2>

            <p>
              <b>Name:</b> {result.name}
            </p>
            <p>
              <b>Client ID:</b> {result.clientId}
            </p>
            <p>
              <b>Client Secret:</b> {result.clientSecret}
            </p>

            <p className="mt-4 text-sm text-red-600">
              Save this client secret now. It will not be shown again.
            </p>

            <a
              href="/system-admin/client-apps"
              className="mt-4 inline-block rounded-lg bg-gray-800 px-4 py-2 text-white"
            >
              Back to Client Apps
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
