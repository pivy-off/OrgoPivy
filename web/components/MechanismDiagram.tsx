"use client";

import Image from "next/image";

type Props = {
  /** Inline SVG or img HTML from mechanism builders */
  html: string;
  /** Optional static asset (takes priority when set) */
  imageSrc?: string;
  alt: string;
};

export default function MechanismDiagram({ html, imageSrc, alt }: Props) {
  if (imageSrc) {
    return (
      <div className="mechanism-diagram-frame">
        <Image
          src={imageSrc}
          alt={alt}
          width={800}
          height={400}
          unoptimized
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      className="mechanism-diagram-frame mechanism-diagram-frame--svg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
