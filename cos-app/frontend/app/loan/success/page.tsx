import { Suspense } from "react";
import LoanSuccessClient from "./LoanSuccessClient";

export default function LoanSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanSuccessClient />
    </Suspense>
  );
}