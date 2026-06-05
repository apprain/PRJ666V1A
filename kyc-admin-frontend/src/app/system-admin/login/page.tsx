"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SystemAdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@kyc.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_KYC_API_URL}/api/v1/system-admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("system_admin_token", data.accessToken);
      localStorage.setItem("system_admin_user", JSON.stringify(data.admin));

      router.push("/system-admin/dashboard");
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold">
          System Admin Login
        </h1>

        <form onSubmit={login} className="space-y-4">
          <input
            className="w-full rounded-lg border p-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            className="w-full rounded-lg border p-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}