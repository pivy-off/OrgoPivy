"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <button
      type="button"
      className="pill"
      onClick={() => setLocale(locale === "en" ? "fr" : "en")}
      style={{
        minHeight: 32,
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
      aria-label={t("translate")}
      title={t("translate")}
    >
      {t("translate")}
    </button>
  );
}
