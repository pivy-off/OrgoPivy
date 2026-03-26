"use client";

export default function TraduireButton() {
  return (
    <button
      type="button"
      className="pill traduireBtn"
      onClick={() => {
        try {
          const u = encodeURIComponent(window.location.href);
          window.open(`https://translate.google.com/translate?sl=auto&tl=fr&u=${u}`, "_blank", "noopener,noreferrer");
        } catch {
          window.open("https://translate.google.com/", "_blank", "noopener,noreferrer");
        }
      }}
    >
      Traduire
    </button>
  );
}
