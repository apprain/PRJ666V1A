"use client";

type CardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function Card({
  title,
  subtitle,
  children,
}: CardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 30,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {title && (
        <h2 style={{ marginTop: 0, marginBottom: 10 }}>
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          style={{
            color: "#666",
            marginBottom: 25,
          }}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}