"use client";

import { useEffect, useState } from "react";

type StatementPdfPreviewProps = {
  token: string;
  serviceUrl: string;
};

export default function StatementPdfPreview({
  token,
  serviceUrl,
}: StatementPdfPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    async function loadPreview() {
      if (!token) {
        setErrorMessage("Statement token is missing.");
        setLoading(false);
        return;
      }

      const authToken = localStorage.getItem("token");

      if (!authToken) {
        setErrorMessage("Login is required to preview the statement.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${serviceUrl.replace(/\/$/, "")}/statement-shares/preview/${token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/pdf",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          let message = "Unable to load statement preview.";

          try {
            const data = await response.json();
            message = data.message || message;
          } catch {
            // Response may not be JSON.
          }

          throw new Error(message);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("The statement preview is empty.");
        }

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setPreviewUrl(objectUrl);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load statement preview.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [serviceUrl, token]);

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading statement preview...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
        Statement preview is not available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">
            Statement Preview
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Review the statement before sharing or downloading.
          </p>
        </div>

        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[#39aa43] px-4 py-2 text-sm font-semibold text-[#29953a] transition hover:bg-green-50"
        >
          Open Full Screen
        </a>
      </div>

      <iframe
        src={previewUrl}
        title="Statement PDF preview"
        className="h-[720px] w-full bg-slate-100"
      />
    </div>
  );
}