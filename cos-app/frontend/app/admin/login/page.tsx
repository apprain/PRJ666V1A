"use client";

import { useState } from "react";

//const API_URL = "http://localhost:3004";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@abccp.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  const login = async () => {
    setMessage("");

    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Login failed");
      return;
    }
    console.log(data.accessToken);
    localStorage.setItem("admin_token", data.accessToken);
    localStorage.setItem("tenant_id", data.tenantId);
    localStorage.setItem("admin_email", data.email);

    window.location.href = `/admin/${data.tenantId}/leads`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Admin Login
        </h1>

        {message && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white"
        >
          Sign In
        </button>
      </div>
    </main>
  );
}