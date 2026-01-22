"use client";

type Props = {
  size?: "small" | "medium" | "large";
  text?: string;
};

export default function LoadingSpinner({ size = "medium", text }: Props) {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid var(--border)`,
          borderTopColor: "var(--blue)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {text && (
        <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>{text}</div>
      )}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
