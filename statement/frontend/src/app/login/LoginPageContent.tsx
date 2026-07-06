'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const kycUrl = process.env.NEXT_PUBLIC_KYC_URL || "http://localhost:4000";
  const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const loginUrl = searchParams.get('redirect') ? 'corp-login' : 'login';


  async function gotoRegistration(e: React.FormEvent) {
       e.preventDefault();
       router.push(kycUrl);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(serviceUrl + '/auth/' + loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      //alert(JSON.stringify(data));
      router.push(redirectUrl);
    } else {
      alert(data.message || 'Login failed');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Access your corporate dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
              href="#"
              onClick={gotoRegistration}
              className="font-semibold text-black hover:underline"
            >
            Register now
          </Link>
        </p>
      </div>
    </main>
  );
}