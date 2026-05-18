'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneno,email, password }),
    });

    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold">Individual's Register</h1>

        <input
          className="mb-3 w-full rounded border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-3 w-full rounded border p-2"
          type="phoneno"
          placeholder="Phone Number"
          value={phoneno}
          onChange={(e) => setPhoneno(e.target.value)}
        />

        <input
          className="mb-3 w-full rounded border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded bg-black p-2 text-white"
          type="submit"
        >
          Register
        </button>
      </form>
    </main>
  );
}