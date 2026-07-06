import { Suspense } from "react";
import BrokerageSuccessContent from "./BrokerageSuccessContent";

export default function BrokerageSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BrokerageSuccessContent />
    </Suspense>
  );
}