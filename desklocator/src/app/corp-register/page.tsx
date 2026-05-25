'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CorpRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationname, setOrganizationName] = useState('');

  
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const serviceUrl =   process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

    const res = await fetch(serviceUrl + '/auth/corp-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        organizationname,
      }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Corporate Registration
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create your organization account
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              type="text"
              placeholder="Enter organization name"
              value={organizationname}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}