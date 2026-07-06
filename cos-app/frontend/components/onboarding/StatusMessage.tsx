"use client";

type StatusType = "info" | "success" | "error" | "warning";

type StatusMessageProps = {
  message?: string;
  type?: StatusType;
};

export default function StatusMessage({
  message,
  type = "info",
}: StatusMessageProps) {
  if (!message) return null;

  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "ℹ️",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "✅",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "⚠️",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "❌",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${style.bg} ${style.border}`}
    >
      <span className="text-lg">{style.icon}</span>

      <div className={`text-sm ${style.text}`}>{message}</div>
    </div>
  );
}
