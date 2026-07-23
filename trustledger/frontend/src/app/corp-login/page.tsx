import { Suspense } from "react";
import CorpLoginPageContent from "./CorpLoginPageContent";

export default function CorpLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fbfdfb]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading organization login...
            </p>
          </div>
        </main>
      }
    >
      <CorpLoginPageContent />
    </Suspense>
  );
}
