"use client";

import { useEffect, useState } from "react";

export default function CreateClientAdminPage() {
  const [clientApps, setClientApps] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Admin@123");
  const [role, setRole] = useState("owner");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("system_admin_token");

    fetch(`${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/client-apps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const apps = Array.isArray(data) ? data : [];
        setClientApps(apps);

        if (apps.length > 0) {
          setClientId(apps[0].clientId);
        }
      });
  }, []);

  async function createClientAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/client-admins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          name,
          email,
          password,
          role,
        }),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Failed to create client admin");
      return;
    }

    setResult(data);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Create Client Admin</h1>

        <form onSubmit={createClientAdmin} className="space-y-4">
          <select
            className="w-full rounded-lg border p-3"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {clientApps.map((app) => (
              <option key={app.id} value={app.clientId}>
                {app.name} ({app.clientId})
              </option>
            ))}
          </select>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Temporary Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full rounded-lg border p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="owner">Owner</option>
            <option value="reviewer">Reviewer</option>
            <option value="viewer">Viewer</option>
          </select>

          <button
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            {loading ? "Creating..." : "Create Client Admin"}
          </button>
        </form>

        {result && (
          <div className="mt-8 rounded-xl border bg-green-50 p-4">
            <h2 className="mb-3 text-xl font-bold">Client Admin Created</h2>

            <p>
              <b>Name:</b> {result.name}
            </p>
            <p>
              <b>Email:</b> {result.email}
            </p>
            <p>
              <b>Role:</b> {result.role}
            </p>

            <p className="mt-4 text-sm text-red-600">
              Share the temporary password securely with the client admin.
            </p>

            <a
              href="/system-admin/client-admins"
              className="mt-4 inline-block rounded-lg bg-gray-800 px-4 py-2 text-white"
            >
              Back to Client Admins
            </a>
          </div>
        )}
      </div>
    </main>
  );
}