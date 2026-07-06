"use client";

type Props = {
  children: React.ReactNode;
};

export default function PageLayout({
  children,
}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
        }}
      >
        {children}
      </div>
    </div>
  );
}