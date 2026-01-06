"use client";

export default function ThemeBootScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const theme = stored || "light";
    document.documentElement.dataset.theme = theme;
    window.__setTheme = function (next) {
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
    };
  } catch (e) {}
})();
        `,
      }}
    />
  );
}
