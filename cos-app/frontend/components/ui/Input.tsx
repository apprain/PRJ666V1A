"use client";

type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  required?: boolean;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: InputProps) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: 6,
          fontSize: 16,
        }}
      />
    </div>
  );
}