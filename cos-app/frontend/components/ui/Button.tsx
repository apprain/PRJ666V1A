"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const primary =
    "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700";

  const secondary =
    "border border-green-600 bg-white text-green-700 hover:bg-green-50";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full rounded-xl px-5 py-3.5",
        "font-semibold text-sm",
        "transition-all duration-200",
        "shadow-sm hover:shadow-md",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" ? primary : secondary,
      ].join(" ")}
    >
      {children}
    </button>
  );
}