"use client";

import { Suspense } from "react";
import KycCallbackContent from "./KycCallbackContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Processing KYC...</div>}>
      <KycCallbackContent />
    </Suspense>
  );
}