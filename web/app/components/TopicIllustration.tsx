// Reusable topic illustration component
type Props = {
  slug: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
};

export default function TopicIllustration({ slug, title, imageUrl, imageAlt }: Props) {
  // Use image from curriculum if available
  if (imageUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: 320,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          position: "relative",
          background: "var(--panel-2)",
        }}
      >
        <img
          src={imageUrl}
          alt={imageAlt || `${title} illustration`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          onError={(e) => {
            // Fallback to SVG if image fails to load
            const container = e.currentTarget.parentElement;
            if (container) {
              container.innerHTML = "";
              const svg = createSVGIllustration(slug, title);
              container.appendChild(svg);
            }
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            padding: "24px",
            color: "white",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>{imageAlt || "Visual representation"}</div>
        </div>
      </div>
    );
  }

  // Fallback to SVG illustrations
  const svg = createSVGIllustration(slug, title);
  return <div dangerouslySetInnerHTML={{ __html: svg.outerHTML }} />;
}

function createSVGIllustration(slug: string, title: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "320");
  svg.setAttribute("viewBox", "0 0 900 320");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${title} illustration`);

  // Create gradient definitions
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  gradient.setAttribute("id", `grad-${slug}`);
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("x2", "1");
  
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0");
  stop1.setAttribute("stop-color", "var(--blue)");
  stop1.setAttribute("stop-opacity", "0.15");
  
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "1");
  stop2.setAttribute("stop-color", "var(--purple)");
  stop2.setAttribute("stop-opacity", "0.15");
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Background
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", "900");
  rect.setAttribute("height", "320");
  rect.setAttribute("rx", "18");
  rect.setAttribute("fill", `url(#grad-${slug})`);
  svg.appendChild(rect);

  // Title text
  const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  titleText.setAttribute("x", "28");
  titleText.setAttribute("y", "64");
  titleText.setAttribute("font-size", "28");
  titleText.setAttribute("font-weight", "700");
  titleText.setAttribute("fill", "var(--text)");
  titleText.textContent = title;
  svg.appendChild(titleText);

  return svg;
}
