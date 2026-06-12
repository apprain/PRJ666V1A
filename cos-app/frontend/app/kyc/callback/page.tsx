'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function KycCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    const status = searchParams.get('status');

    console.log('KYC callback:', { sessionId, status });


    router.push('/dashboard');
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Completing KYC verification...</p>
    </main>
  );
}

export default function KycCallbackPage() {
  return (
    <Suspense fallback={<p>Loading KYC callback...</p>}>
      <KycCallbackContent />
    </Suspense>
  );
}