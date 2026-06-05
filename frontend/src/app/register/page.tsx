"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Link } from "lucide-react";



export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  async function goToLogin() {
    document.location = "/login";
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(serviceUrl + '/auth/register', {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data));
    //router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Registration</h1>
          <p className="mt-2 text-sm text-gray-500">
            Customer Registration
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
        >
          <h1 className="mb-4 text-2xl font-bold">Registration</h1>

          <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              
            <input
              className="mb-3 w-full rounded border p-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

                    <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
          <input
            className="mb-3 w-full rounded border p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="mb-3 w-full rounded bg-black p-2 text-white"
            type="submit"
          >
            Register
          </button>

          <p>
            Already have an account? &nbsp;
            <a href="#" onClick={goToLogin}  className="font-semibold text-black hover:underline">
              Login now
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
