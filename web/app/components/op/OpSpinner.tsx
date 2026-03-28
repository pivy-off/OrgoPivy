export default function OpSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="opSpinner" role="status" aria-live="polite">
      <span className="opSpinnerDot" aria-hidden />
      <span className="opSpinnerLabel">{label}</span>
    </div>
  );
}
