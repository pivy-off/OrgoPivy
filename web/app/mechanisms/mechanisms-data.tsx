// All mechanism SVG components and data
"use client";

import React from "react";

export type ConditionState = {
  heat: boolean;
  acid: boolean;
  base: boolean;
  polarAprotic: boolean;
};

export type MechanismStep = {
  title: string;
  explanation: string;
  svg: (conditions: ConditionState) => React.ReactElement;
  /** Optional raw SVG markup (trusted) rendered below the interactive step diagram. */
  svgContent?: string;
  example?: {
    reactant: string;
    product: string;
    conditions: string;
  };
};

export type Mechanism = {
  id: string;
  name: string;
  category: string;
  course: "orgochem-1" | "orgochem-2";
  reagents: string;
  result: string;
  notes: string;
  tags: string[];
  steps: MechanismStep[];
  exampleReaction?: {
    reactant: string;
    product: string;
    fullReaction: string;
  };
};

// SVG Drawing Utilities
function drawBond(x1: number, y1: number, x2: number, y2: number, type: "single" | "double" | "triple" = "single", color: string = "#111") {
  const elements = [];
  if (type === "single") {
    elements.push(<line key="bond" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />);
  } else if (type === "double") {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len * 4;
    const perpY = dx / len * 4;
    elements.push(<line key="bond1" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />);
    elements.push(<line key="bond2" x1={x1 + perpX} y1={y1 + perpY} x2={x2 + perpX} y2={y2 + perpY} stroke={color} strokeWidth="3" strokeLinecap="round" />);
  } else if (type === "triple") {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len * 5;
    const perpY = dx / len * 5;
    elements.push(<line key="bond1" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />);
    elements.push(<line key="bond2" x1={x1 + perpX} y1={y1 + perpY} x2={x2 + perpX} y2={y2 + perpY} stroke={color} strokeWidth="3" strokeLinecap="round" />);
    elements.push(<line key="bond3" x1={x1 - perpX} y1={y1 - perpY} x2={x2 - perpX} y2={y2 - perpY} stroke={color} strokeWidth="3" strokeLinecap="round" />);
  }
  return elements;
}

function drawAtom(x: number, y: number, label: string, charge?: string, lonePairs?: number, color: string = "#111") {
  return (
    <g key={`atom-${x}-${y}`}>
      <circle cx={x} cy={y} r="20" fill="white" stroke={color} strokeWidth="2.5" />
      <text x={x} y={y + 6} textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>
        {label}
      </text>
      {charge && (
        <text x={x + 14} y={y - 10} fontSize="13" fontWeight="700" fill={charge === "+" ? "#FF3B30" : charge === "−" ? "#007AFF" : color}>
          {charge}
        </text>
      )}
      {lonePairs !== undefined && lonePairs > 0 && (
        <g>
          {[...Array(Math.min(lonePairs, 4))].map((_, i) => {
            const angle = (i * 360) / (lonePairs * 2);
            const rad = angle * (Math.PI / 180);
            const px = x + Math.cos(rad) * 28;
            const py = y + Math.sin(rad) * 28;
            return <circle key={i} cx={px} cy={py} r="2.5" fill={color} />;
          })}
        </g>
      )}
    </g>
  );
}

function drawCurvedArrow(x1: number, y1: number, x2: number, y2: number, color: string = "#007AFF", label?: string, animated: boolean = false) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const controlOffset = Math.sqrt(dx * dx + dy * dy) * 0.35;
  const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * controlOffset;
  const perpY = dx / Math.sqrt(dx * dx + dy * dy) * controlOffset;
  
  const cx1 = x1 + perpX;
  const cy1 = y1 + perpY;
  const cx2 = x2 + perpX;
  const cy2 = y2 + perpY;
  
  const path = `M ${x1} ${y1} Q ${cx1} ${cy1} ${midX} ${midY} T ${x2} ${y2}`;
  
  // Arrowhead
  const angle = Math.atan2(y2 - midY, x2 - midX);
  const arrowLength = 14;
  const arrowAngle = Math.PI / 6;
  const arrowX1 = x2 - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = y2 - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = x2 - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = y2 - arrowLength * Math.sin(angle + arrowAngle);
  
  return (
    <g key={`arrow-${x1}-${y1}-${x2}-${y2}`}>
      <path 
        d={path} 
        fill="none" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
        opacity={animated ? 0.7 : 1}
        style={animated ? {
          strokeDasharray: "10,5",
          animation: "dash 2s linear infinite"
        } : {}}
      />
      <polygon 
        points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} 
        fill={color} 
        opacity={animated ? 0.7 : 1}
      />
      {label && (
        <text 
          x={midX + perpX * 0.5} 
          y={midY + perpY * 0.5} 
          fontSize="16" 
          fill={color} 
          fontWeight="700"
          style={{ textShadow: "0 0 4px white, 0 0 4px white" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function drawDoubleArrow(x1: number, y1: number, x2: number, y2: number) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="3" />
      <polygon points={`${x2},${y2} ${x2 - 14},${y2 - 6} ${x2 - 14},${y2 + 6}`} fill="#111" />
      <polygon points={`${x1},${y1} ${x1 + 14},${y1 - 6} ${x1 + 14},${y1 + 6}`} fill="#111" />
    </g>
  );
}

// Line-angle structure drawing utilities
function drawLineAngleBond(x1: number, y1: number, x2: number, y2: number, type: "single" | "double" | "triple" = "single", color: string = "#111", width: number = 3) {
  const elements = [];
  if (type === "single") {
    elements.push(<line key="bond" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />);
  } else if (type === "double") {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len * 5;
    const perpY = dx / len * 5;
    elements.push(<line key="bond1" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />);
    elements.push(<line key="bond2" x1={x1 + perpX} y1={y1 + perpY} x2={x2 + perpX} y2={y2 + perpY} stroke={color} strokeWidth={width} strokeLinecap="round" />);
  } else if (type === "triple") {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len * 6;
    const perpY = dx / len * 6;
    elements.push(<line key="bond1" x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />);
    elements.push(<line key="bond2" x1={x1 + perpX} y1={y1 + perpY} x2={x2 + perpX} y2={y2 + perpY} stroke={color} strokeWidth={width} strokeLinecap="round" />);
    elements.push(<line key="bond3" x1={x1 - perpX} y1={y1 - perpY} x2={x2 - perpX} y2={y2 - perpY} stroke={color} strokeWidth={width} strokeLinecap="round" />);
  }
  return elements;
}

function drawLineAngleAtom(x: number, y: number, label?: string, charge?: string, color: string = "#111") {
  const elements = [];
  if (label && label !== "C" && label !== "H") {
    // Only show non-carbon, non-hydrogen atoms explicitly
    elements.push(
      <circle key={`atom-${x}-${y}`} cx={x} cy={y} r="12" fill="white" stroke={color} strokeWidth="2" />
    );
    elements.push(
      <text key={`text-${x}-${y}`} x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={color}>
        {label}
      </text>
    );
  }
  if (charge) {
    const chargeColor = charge.includes("+") ? "#FF3B30" : charge.includes("−") || charge.includes("-") ? "#007AFF" : color;
    elements.push(
      <text key={`charge-${x}-${y}`} x={x + 12} y={y - 8} fontSize="16" fontWeight="700" fill={chargeColor}>
        {charge}
      </text>
    );
  }
  return elements;
}

function drawLineAngleStructure(structure: { bonds: Array<{ x1: number; y1: number; x2: number; y2: number; type?: "single" | "double" | "triple" }>; atoms?: Array<{ x: number; y: number; label?: string; charge?: string }>; labels?: Array<{ x: number; y: number; text: string; offset?: { x: number; y: number } }> }, x: number, y: number) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {structure.bonds.map((bond, i) => drawLineAngleBond(bond.x1, bond.y1, bond.x2, bond.y2, bond.type || "single"))}
      {structure.atoms?.map((atom, i) => (
        <g key={i}>
          {drawLineAngleAtom(atom.x, atom.y, atom.label, atom.charge)}
        </g>
      ))}
      {structure.labels?.map((label, i) => (
        <text key={i} x={label.x + (label.offset?.x || 0)} y={label.y + (label.offset?.y || 0)} fontSize="14" fill="#666" fontWeight="600">
          {label.text}
        </text>
      ))}
    </g>
  );
}

// Helper function to draw structure with both line-angle and condensed formula
function drawStructureWithBoth(
  x: number, 
  y: number, 
  lineAngle: React.ReactElement, 
  condensed: string, 
  label?: string
) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Line-angle structure */}
      <g transform="translate(0, 0)">
        {lineAngle}
        <text x={0} y={-80} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Line-angle</text>
      </g>
      
      {/* Condensed formula below */}
      <g transform="translate(0, 120)">
        <rect x={-100} y={-20} width={200} height={50} rx={8} fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="2" />
        <text x={0} y={10} fontSize="24" fontWeight="700" fill="#111" fontFamily="monospace" textAnchor="middle">
          {condensed}
        </text>
        <text x={0} y={50} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Condensed</text>
      </g>
      
      {/* Optional label */}
      {label && (
        <text x={0} y={200} fontSize="20" fill="#007AFF" fontWeight="700" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

// Mechanism SVG Components
function HydrohalogenationStep1() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-hh1" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 1: Protonation</text>
      <text x="80" y="120" fontSize="26" fill="#666">Pi electrons attack H⁺, forming carbocation</text>
      
      {/* Alkene - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 160, 0, "double", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, -40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, 40, "single", "#111", 6)}
        </g>,
        "H₂C=CHCH₃",
        "Alkene (π bond)"
      )}
      
      {/* HBr - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleBond(0, 0, 70, 0, "single", "#111", 6)}
          {drawLineAngleAtom(0, 0, "H", "+")}
          {drawLineAngleAtom(70, 0, "Br", "−")}
        </g>,
        "HBr"
      )}
      
      {/* Curved arrow from pi bond to H⁺ */}
      {drawCurvedArrow(460, 300, 730, 300, "#007AFF", "π e⁻", false)}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Carbocation - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 0, "single", "#111", 6)}
          {drawLineAngleAtom(50, 0, undefined, "+")}
        </g>,
        "H₃CCH⁺CH₃",
        "Carbocation (2° → more stable)"
      )}
    </svg>
  );
}

function HydrohalogenationStep2() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-hh2" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 2: Halide Attack</text>
      <text x="80" y="120" fontSize="26" fill="#666">Br⁻ attacks carbocation</text>
      
      {/* Carbocation - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 0, "single", "#111", 6)}
          {drawLineAngleAtom(50, 0, undefined, "+")}
        </g>,
        "H₃CCH⁺CH₃",
        "Carbocation (electrophile)"
      )}
      
      {/* Br⁻ - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "Br", "−")}
        </g>,
        "Br⁻",
        "Nucleophile"
      )}
      
      {/* Curved arrow from Br⁻ to carbocation */}
      {drawCurvedArrow(700, 300, 400, 300, "#007AFF", "Nu⁻", false)}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Product - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 0, "single", "#111", 6)}
          {drawLineAngleAtom(100, 0, "Br")}
        </g>,
        "H₃CCHBrCH₃",
        "Markovnikov product"
      )}
    </svg>
  );
}

function HalogenationStep1() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-hal1" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 1: Halonium Ion Formation</text>
      <text x="80" y="120" fontSize="26" fill="#666">Pi electrons attack Br₂, form three-membered ring</text>
      
      {/* Alkene - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 160, 0, "double", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, -40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, 40, "single", "#111", 6)}
        </g>,
        "H₂C=CHCH₃",
        "Alkene (π bond)"
      )}
      
      {/* Br₂ - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleBond(0, 0, 80, 0, "single", "#111", 6)}
          {drawLineAngleAtom(0, 0, "Br")}
          {drawLineAngleAtom(80, 0, "Br")}
        </g>,
        "Br₂"
      )}
      
      {/* Curved arrow */}
      {drawCurvedArrow(460, 300, 720, 300, "#007AFF", "π e⁻", false)}
      
      {/* Arrow to intermediate */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Halonium ion - with both representations */}
      <g transform="translate(1300, 300)">
        {/* Line-angle: three-membered ring */}
        <g>
          <path d="M 0,60 L -55,-30 L 55,-30 Z" fill="none" stroke="#007AFF" strokeWidth="6" strokeDasharray="12,6" />
          {drawLineAngleBond(0, 60, -55, -30, "single", "#111", 6)}
          {drawLineAngleBond(-55, -30, 55, -30, "single", "#111", 6)}
          {drawLineAngleBond(55, -30, 0, 60, "single", "#111", 6)}
          {drawLineAngleAtom(0, 15, "Br", "+")}
        </g>
        <text x={0} y={-90} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Line-angle</text>
        
        {/* Condensed formula */}
        <g transform="translate(0, 120)">
          <rect x={-120} y={-25} width={240} height={60} rx={10} fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="3" />
          <text x={0} y={10} fontSize="28" fontWeight="700" fill="#111" fontFamily="monospace" textAnchor="middle">
            Halonium ion
          </text>
          <text x={0} y={35} fontSize="22" fontWeight="600" fill="#666" fontFamily="monospace" textAnchor="middle">
            (Br⁺ bridge)
          </text>
          <text x={0} y={70} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Condensed</text>
        </g>
        
        <text x={0} y={220} fontSize="22" fill="#007AFF" fontWeight="700" textAnchor="middle">
          Three-membered ring
        </text>
      </g>
    </svg>
  );
}

function HalogenationStep2() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-hal2" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 2: Backside Attack</text>
      <text x="80" y="120" fontSize="26" fill="#666">Br⁻ attacks from opposite face (anti addition)</text>
      
      {/* Halonium ion - with both representations */}
      <g transform="translate(300, 300)">
        {/* Line-angle */}
        <g>
          <path d="M 0,60 L -55,-30 L 55,-30 Z" fill="none" stroke="#111" strokeWidth="6" />
          {drawLineAngleBond(0, 60, -55, -30, "single", "#111", 6)}
          {drawLineAngleBond(-55, -30, 55, -30, "single", "#111", 6)}
          {drawLineAngleBond(55, -30, 0, 60, "single", "#111", 6)}
          {drawLineAngleAtom(0, 15, "Br", "+")}
        </g>
        <text x={0} y={-90} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Line-angle</text>
        
        {/* Condensed */}
        <g transform="translate(0, 120)">
          <rect x={-120} y={-25} width={240} height={60} rx={10} fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="3" />
          <text x={0} y={10} fontSize="28" fontWeight="700" fill="#111" fontFamily="monospace" textAnchor="middle">
            Halonium ion
          </text>
          <text x={0} y={35} fontSize="22" fontWeight="600" fill="#666" fontFamily="monospace" textAnchor="middle">
            (Br⁺ bridge)
          </text>
          <text x={0} y={70} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Condensed</text>
        </g>
      </g>
      
      {/* Br⁻ - with both representations */}
      {drawStructureWithBoth(
        800,
        250,
        <g>
          {drawLineAngleAtom(0, 0, "Br", "−")}
        </g>,
        "Br⁻",
        "Nucleophile"
      )}
      
      {/* Curved arrow from backside */}
      {drawCurvedArrow(700, 250, 355, 330, "#007AFF", "backside", false)}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Product - vicinal dihalide - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 120, 0, "single", "#111", 6)}
          {drawLineAngleBond(60, 0, 60, -60, "single", "#111", 6)}
          {drawLineAngleBond(60, 0, 60, 60, "single", "#111", 6)}
          {drawLineAngleAtom(60, -60, "Br")}
          {drawLineAngleAtom(60, 60, "Br")}
        </g>,
        "CH₃CHBrCH₂Br",
        "Anti addition (trans)"
      )}
    </svg>
  );
}

function HydroborationStep1() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-hb1" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 1: Borane Addition</text>
      <text x="80" y="120" fontSize="26" fill="#666">BH₃ adds with syn stereochemistry (four-membered TS)</text>
      
      {/* Alkene - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 160, 0, "double", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, -40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, 40, "single", "#111", 6)}
        </g>,
        "H₂C=CHCH₃",
        "Alkene"
      )}
      
      {/* BH₃ - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "B")}
          {drawLineAngleBond(0, 0, 50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, 50, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, 50, 40, "single", "#111", 6)}
        </g>,
        "BH₃"
      )}
      
      {/* Curved arrows showing syn addition */}
      {drawCurvedArrow(460, 300, 720, 300, "#007AFF", "syn", false)}
      {drawCurvedArrow(850, 300, 460, 300, "#007AFF", undefined, false)}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Organoborane - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 110, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(110, 0, 160, -40, "single", "#111", 6)}
          {drawLineAngleBond(110, 0, 160, 40, "single", "#111", 6)}
          {drawLineAngleAtom(110, 0, "B")}
        </g>,
        "H₃CCH₂CH₂BH₂",
        "Anti-Markovnikov, Syn addition"
      )}
    </svg>
  );
}

function SN2Mechanism() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-sn2" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">SN2: Backside Attack</text>
      <text x="80" y="120" fontSize="26" fill="#666">One step, inversion of configuration</text>
      
      {/* Substrate - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 120, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleAtom(120, 0, "Br")}
        </g>,
        "CH₃CH₂Br",
        "Substrate"
      )}
      
      {/* Nucleophile - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "OH", "−")}
        </g>,
        "OH⁻",
        "Nucleophile"
      )}
      
      {/* Curved arrow from backside */}
      {drawCurvedArrow(720, 300, 420, 300, "#007AFF", "180°", false)}
      
      {/* Transition state indicator */}
      <g transform="translate(550, 300)">
        <rect x={-60} y={-50} width={120} height={100} rx={12} fill="none" stroke="#FF6B00" strokeWidth="5" strokeDasharray="8,8" />
        <text x={0} y={5} textAnchor="middle" fontSize="22" fill="#FF6B00" fontWeight="700">TS</text>
      </g>
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Product with inversion - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 120, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleAtom(120, 0, "OH")}
        </g>,
        "CH₃CH₂OH",
        "Inverted configuration"
      )}
    </svg>
  );
}

// Oxymercuration mechanism steps
function OxymercurationStep1() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-oxy1" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 1: Mercurinium Ion Formation</text>
      <text x="80" y="120" fontSize="26" fill="#666">Pi electrons attack Hg²⁺, forming three-membered ring</text>
      
      {/* Alkene - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 160, 0, "double", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, -40, "single", "#111", 6)}
          {drawLineAngleBond(160, 0, 210, 40, "single", "#111", 6)}
        </g>,
        "H₂C=CHCH₃",
        "Alkene (π bond)"
      )}
      
      {/* Hg(OAc)₂ - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "Hg", "2+")}
          <text x={0} y={-30} fontSize="18" fill="#666" fontWeight="600">Hg(OAc)₂</text>
        </g>,
        "Hg(OAc)₂"
      )}
      
      {/* Curved arrow */}
      {drawCurvedArrow(460, 300, 720, 300, "#007AFF", "π e⁻", false)}
      
      {/* Arrow to intermediate */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Mercurinium ion - with both representations */}
      <g transform="translate(1300, 300)">
        {/* Line-angle: three-membered ring */}
        <g>
          <path d="M 0,60 L -55,-30 L 55,-30 Z" fill="none" stroke="#007AFF" strokeWidth="6" strokeDasharray="12,6" />
          {drawLineAngleBond(0, 60, -55, -30, "single", "#111", 6)}
          {drawLineAngleBond(-55, -30, 55, -30, "single", "#111", 6)}
          {drawLineAngleBond(55, -30, 0, 60, "single", "#111", 6)}
          {drawLineAngleAtom(0, 15, "Hg", "2+")}
        </g>
        <text x={0} y={-90} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Line-angle</text>
        
        {/* Condensed */}
        <g transform="translate(0, 120)">
          <rect x={-140} y={-25} width={280} height={60} rx={10} fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="3" />
          <text x={0} y={10} fontSize="28" fontWeight="700" fill="#111" fontFamily="monospace" textAnchor="middle">
            Mercurinium ion
          </text>
          <text x={0} y={35} fontSize="22" fontWeight="600" fill="#666" fontFamily="monospace" textAnchor="middle">
            (Hg²⁺ bridge)
          </text>
          <text x={0} y={70} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Condensed</text>
        </g>
        
        <text x={0} y={220} fontSize="22" fill="#007AFF" fontWeight="700" textAnchor="middle">
          Three-membered ring, no rearrangement
        </text>
      </g>
    </svg>
  );
}

function OxymercurationStep2() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-oxy2" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 2: Water Attack - Markovnikov</text>
      <text x="80" y="120" fontSize="26" fill="#666">H₂O attacks more substituted carbon</text>
      
      {/* Mercurinium ion - with both representations */}
      <g transform="translate(300, 300)">
        <g>
          <path d="M 0,60 L -55,-30 L 55,-30 Z" fill="none" stroke="#111" strokeWidth="6" />
          {drawLineAngleBond(0, 60, -55, -30, "single", "#111", 6)}
          {drawLineAngleBond(-55, -30, 55, -30, "single", "#111", 6)}
          {drawLineAngleBond(55, -30, 0, 60, "single", "#111", 6)}
          {drawLineAngleAtom(0, 15, "Hg", "2+")}
        </g>
        <text x={0} y={-90} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Line-angle</text>
        
        <g transform="translate(0, 120)">
          <rect x={-140} y={-25} width={280} height={60} rx={10} fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="3" />
          <text x={0} y={10} fontSize="28" fontWeight="700" fill="#111" fontFamily="monospace" textAnchor="middle">
            Mercurinium ion
          </text>
          <text x={0} y={35} fontSize="22" fontWeight="600" fill="#666" fontFamily="monospace" textAnchor="middle">
            (Hg²⁺ bridge)
          </text>
          <text x={0} y={70} fontSize="18" fill="#666" fontWeight="600" textAnchor="middle">Condensed</text>
        </g>
      </g>
      
      {/* H₂O - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "O")}
          {drawLineAngleBond(0, 0, 40, -30, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, 40, 30, "single", "#111", 6)}
        </g>,
        "H₂O",
        "Nucleophile"
      )}
      
      {/* Curved arrow */}
      {drawCurvedArrow(700, 300, 355, 330, "#007AFF", "Nu", false)}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Product - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleAtom(50, 0, "OH")}
          {drawLineAngleAtom(100, 0, "Hg")}
        </g>,
        "H₃CCH(OH)CH₂HgOAc",
        "Markovnikov: OH to more substituted"
      )}
    </svg>
  );
}

function OxymercurationStep3() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead-oxy3" markerWidth="14" markerHeight="14" refX="13" refY="5" orient="auto">
          <polygon points="0 0, 14 5, 0 10" fill="#007AFF" />
        </marker>
      </defs>
      
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">Step 3: Demercuration</text>
      <text x="80" y="120" fontSize="26" fill="#666">NaBH₄ replaces Hg with H</text>
      
      {/* Organomercury compound - with both representations */}
      {drawStructureWithBoth(
        300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleAtom(50, 0, "OH")}
          {drawLineAngleAtom(100, 0, "Hg")}
        </g>,
        "H₃CCH(OH)CH₂HgOAc",
        "Organomercury compound"
      )}
      
      {/* NaBH₄ - with both representations */}
      {drawStructureWithBoth(
        800,
        300,
        <g>
          {drawLineAngleAtom(0, 0, "B")}
          {drawLineAngleBond(0, 0, 50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, 50, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, 50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
        </g>,
        "NaBH₄"
      )}
      
      {/* Arrow to product */}
      <g transform="translate(1100, 300)">
        {drawDoubleArrow(0, 0, 140, 0)}
      </g>
      
      {/* Final alcohol product - with both representations */}
      {drawStructureWithBoth(
        1300,
        300,
        <g>
          {drawLineAngleBond(0, 0, 100, 0, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, -40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 40, "single", "#111", 6)}
          {drawLineAngleBond(0, 0, -50, 0, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, -40, "single", "#111", 6)}
          {drawLineAngleBond(100, 0, 150, 40, "single", "#111", 6)}
          {drawLineAngleAtom(50, 0, "OH")}
        </g>,
        "H₃CCH(OH)CH₃",
        "Markovnikov alcohol, no rearrangements"
      )}
    </svg>
  );
}

// Additional mechanism SVG components
function createSimpleMechanismSVG(title: string, description: string, structure: string, keyPoint: string) {
  return () => (
    <svg width="100%" height="100%" viewBox="0 0 2200 1100" style={{ background: "white", borderRadius: 12 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`textGrad-${title.replace(/\s/g, "")}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#007AFF" />
          <stop offset="100%" stopColor="#5856D6" />
        </linearGradient>
      </defs>
      <text x="80" y="70" fontSize="44" fontWeight="700" fill="#111">{title}</text>
      <text x="80" y="120" fontSize="26" fill="#666">{description}</text>
      <rect x="400" y="380" width="900" height="280" rx="24" fill="#f8f9fa" stroke="#e5e5e5" strokeWidth="5" />
      <text x="850" y="520" textAnchor="middle" fontSize="40" fontWeight="700" fill="#111" fontFamily="monospace" style={{ letterSpacing: "3px" }}>{structure}</text>
      <text x="850" y="580" textAnchor="middle" fontSize="28" fill={`url(#textGrad-${title.replace(/\s/g, "")})`} fontWeight="700">{keyPoint}</text>
      <text x="850" y="700" textAnchor="middle" fontSize="22" fill="#666" fontWeight="600">Condensed formula</text>
    </svg>
  );
}

// Export all mechanisms data
export function getAllMechanisms(): Mechanism[] {
  return [
    {
      id: "alkene-hydrohalogenation",
      name: "Hydrohalogenation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "HCl, HBr, or HI",
      result: "Markovnikov addition",
      notes: "Carbocation rearrangements possible",
      tags: ["alkene", "addition", "markovnikov", "carbocation"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + HBr",
        product: "CH₃CHBrCH₃",
        fullReaction: "CH₃CH=CH₂ + HBr → CH₃CHBrCH₃",
      },
      steps: [
        {
          title: "Step 1: Protonation - Carbocation Formation",
          explanation:
            "The pi electrons of the alkene attack H⁺ from HX, forming a carbocation. Markovnikov's rule: H adds to the less substituted carbon, leaving the positive charge on the more substituted (more stable) carbon. This carbocation can rearrange if a more stable one is possible (e.g., 1° → 2° or 3°).",
          svg: () => <HydrohalogenationStep1 />,
          example: {
            reactant: "CH₃CH=CH₂",
            product: "CH₃CH⁺CH₃",
            conditions: "HBr",
          },
        },
        {
          title: "Step 2: Halide Attack",
          explanation:
            "The halide ion (X⁻) attacks the carbocation, forming the alkyl halide product. The product follows Markovnikov's rule: the halogen ends up on the more substituted carbon. If rearrangement occurred, the halogen will be on the more stable carbocation position.",
          svg: () => <HydrohalogenationStep2 />,
          example: {
            reactant: "CH₃CH⁺CH₃",
            product: "CH₃CHBrCH₃",
            conditions: "Br⁻",
          },
        },
      ],
    },
    {
      id: "alkene-halogenation",
      name: "Halogenation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "Br₂ or Cl₂",
      result: "Anti addition, vicinal dihalide",
      notes: "Halonium ion intermediate",
      tags: ["alkene", "addition", "anti", "halonium"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + Br₂",
        product: "CH₃CHBrCH₂Br",
        fullReaction: "CH₃CH=CH₂ + Br₂ → CH₃CHBrCH₂Br (anti)",
      },
      steps: [
        {
          title: "Step 1: Halonium Ion Formation",
          explanation:
            "The pi electrons attack one halogen atom, forming a three-membered halonium ion (cyclic intermediate). The positive charge is on the halogen. This is a bridged intermediate that prevents rotation.",
          svg: () => <HalogenationStep1 />,
          example: {
            reactant: "CH₃CH=CH₂ + Br₂",
            product: "Halonium ion",
            conditions: "Br₂",
          },
        },
        {
          title: "Step 2: Backside Attack - Anti Addition",
          explanation:
            "The halide ion attacks from the backside (opposite face) of the halonium ion, opening the ring. This gives anti addition: the two halogens are trans to each other. The product is a vicinal dihalide (1,2-dihalide).",
          svg: () => <HalogenationStep2 />,
          example: {
            reactant: "Halonium ion",
            product: "CH₃CHBrCH₂Br",
            conditions: "Br⁻ (anti addition)",
          },
        },
      ],
    },
    {
      id: "alkene-hydroboration",
      name: "Hydroboration-Oxidation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "BH₃/THF, then H₂O₂/OH⁻",
      result: "Anti-Markovnikov alcohol, syn addition",
      notes: "Four-membered transition state, syn stereochemistry",
      tags: ["alkene", "addition", "anti-markovnikov", "syn", "boron"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + BH₃ then H₂O₂/OH⁻",
        product: "CH₃CH₂CH₂OH",
        fullReaction: "CH₃CH=CH₂ → CH₃CH₂CH₂OH (anti-Markovnikov)",
      },
      steps: [
        {
          title: "Step 1: Borane Addition - Syn",
          explanation:
            "BH₃ adds to the alkene with syn stereochemistry (both add to same face). The mechanism involves a four-membered transition state. Boron adds to less substituted carbon, H adds to more substituted - this is anti-Markovnikov regiochemistry.",
          svg: () => <HydroborationStep1 />,
          example: {
            reactant: "CH₃CH=CH₂ + BH₃",
            product: "CH₃CH₂CH₂BH₂",
            conditions: "BH₃/THF (syn addition)",
          },
        },
        {
          title: "Step 2: Oxidation to Alcohol",
          explanation:
            "H₂O₂ and NaOH oxidize the borane to an alcohol. The OH group replaces the boron, maintaining the anti-Markovnikov regiochemistry. The stereochemistry remains syn (both OH and H are cis).",
          svg: () => <HydrohalogenationStep2 />,
          example: {
            reactant: "CH₃CH₂CH₂BH₂",
            product: "CH₃CH₂CH₂OH",
            conditions: "H₂O₂/OH⁻",
          },
        },
      ],
    },
    {
      id: "alkene-hydrohalogenation-peroxide",
      name: "Hydrohalogenation with Peroxides",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "HBr + ROOR (peroxides)",
      result: "Anti-Markovnikov addition",
      notes: "Radical mechanism, no rearrangements",
      tags: ["alkene", "addition", "anti-markovnikov", "radical"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + HBr + ROOR",
        product: "CH₃CH₂CH₂Br",
        fullReaction: "CH₃CH=CH₂ + HBr + ROOR → CH₃CH₂CH₂Br (anti-Markovnikov)",
      },
      steps: [
        {
          title: "Step 1: Radical Initiation",
          explanation: "Peroxides (ROOR) break homolytically to form alkoxy radicals (RO•). This initiates the radical chain reaction. The radical mechanism gives anti-Markovnikov regiochemistry, opposite to the ionic mechanism.",
          svg: createSimpleMechanismSVG("Step 1: Initiation", "ROOR → 2 RO• (radical initiation)", "ROOR → 2 RO•", "Radical mechanism begins"),
          example: { reactant: "ROOR", product: "2 RO•", conditions: "Heat or light" },
        },
        {
          title: "Step 2: Radical Addition",
          explanation: "Br• radical adds to the less substituted carbon of the alkene, forming a more stable radical on the more substituted carbon. This is anti-Markovnikov: Br goes to less substituted, H goes to more substituted.",
          svg: createSimpleMechanismSVG("Step 2: Br• Addition", "Br• adds to less substituted carbon", "CH₃CH=CH₂ + Br• → CH₃CH₂CH₂•", "Anti-Markovnikov: Br to less substituted"),
          example: { reactant: "CH₃CH=CH₂ + Br•", product: "CH₃CH₂CH₂•", conditions: "Radical addition" },
        },
        {
          title: "Step 3: H Abstraction",
          explanation: "The carbon radical abstracts H from HBr, giving the anti-Markovnikov product and regenerating Br• to continue the chain. No carbocation intermediate, so no rearrangements occur.",
          svg: createSimpleMechanismSVG("Step 3: H Abstraction", "Radical abstracts H from HBr", "CH₃CH₂CH₂• + HBr → CH₃CH₂CH₂Br + Br•", "Anti-Markovnikov product, no rearrangements"),
          example: { reactant: "CH₃CH₂CH₂• + HBr", product: "CH₃CH₂CH₂Br + Br•", conditions: "H abstraction" },
        },
      ],
    },
    {
      id: "alkene-halohydrin",
      name: "Halohydrin Formation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "Br₂ or Cl₂ + H₂O",
      result: "Anti addition, OH to more substituted carbon",
      notes: "Halonium ion intermediate, water as nucleophile",
      tags: ["alkene", "addition", "anti", "halonium", "water"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + Br₂ + H₂O",
        product: "CH₃CH(OH)CH₂Br",
        fullReaction: "CH₃CH=CH₂ + Br₂ + H₂O → CH₃CH(OH)CH₂Br (anti)",
      },
      steps: [
        {
          title: "Step 1: Halonium Ion Formation",
          explanation: "Same as halogenation: pi electrons attack X₂, forming the halonium ion intermediate. The three-membered ring prevents rotation and controls stereochemistry.",
          svg: () => <HalogenationStep1 />,
          example: { reactant: "CH₃CH=CH₂ + Br₂", product: "Halonium ion", conditions: "Br₂" },
        },
        {
          title: "Step 2: Water Attack - Regioselective",
          explanation: "Water attacks the more substituted carbon of the halonium ion (more electrophilic due to partial positive charge). This gives the halohydrin: OH on more substituted carbon, X on less substituted. Anti addition occurs.",
          svg: createSimpleMechanismSVG("Step 2: Water Attack", "H₂O attacks more substituted carbon", "Halonium + H₂O → CH₃CH(OH)CH₂Br", "OH to more substituted, X to less substituted"),
          example: { reactant: "Halonium ion + H₂O", product: "CH₃CH(OH)CH₂Br", conditions: "H₂O (anti addition)" },
        },
      ],
    },
    {
      id: "alkene-acid-hydration",
      name: "Acid-Catalyzed Hydration",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "H₂SO₄ + H₂O",
      result: "Markovnikov alcohol",
      notes: "Rearrangements possible",
      tags: ["alkene", "addition", "hydration", "markovnikov", "carbocation"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + H₂SO₄ + H₂O",
        product: "CH₃CH(OH)CH₃",
        fullReaction: "CH₃CH=CH₂ + H₂SO₄ + H₂O → CH₃CH(OH)CH₃ (Markovnikov)",
      },
      steps: [
        {
          title: "Step 1: Protonation - Carbocation Formation",
          explanation: "The alkene pi electrons attack H⁺ (from H₂SO₄), forming a carbocation. This follows Markovnikov's rule: H adds to less substituted carbon, positive charge on more substituted. The carbocation can rearrange if a more stable one is possible.",
          svg: () => <HydrohalogenationStep1 />,
          example: { reactant: "CH₃CH=CH₂ + H⁺", product: "CH₃CH⁺CH₃", conditions: "H₂SO₄" },
        },
        {
          title: "Step 2: Water Addition",
          explanation: "Water attacks the carbocation, forming an oxonium ion. The water adds to the more substituted carbon (where the positive charge is), following Markovnikov regiochemistry.",
          svg: createSimpleMechanismSVG("Step 2: Water Addition", "H₂O attacks carbocation", "CH₃CH⁺CH₃ + H₂O → CH₃CH(OH₂⁺)CH₃", "Oxonium ion forms"),
          example: { reactant: "CH₃CH⁺CH₃ + H₂O", product: "CH₃CH(OH₂⁺)CH₃", conditions: "H₂O" },
        },
        {
          title: "Step 3: Deprotonation",
          explanation: "Water (or HSO₄⁻) removes a proton from the oxonium ion, giving the alcohol product. The OH group ends up on the more substituted carbon (Markovnikov). If rearrangement occurred, the OH will be on the more stable position.",
          svg: createSimpleMechanismSVG("Step 3: Deprotonation", "Base removes H+, alcohol forms", "CH₃CH(OH₂⁺)CH₃ → CH₃CH(OH)CH₃", "Markovnikov alcohol (OH on more substituted C)"),
          example: { reactant: "CH₃CH(OH₂⁺)CH₃", product: "CH₃CH(OH)CH₃", conditions: "H₂O (deprotonation)" },
        },
      ],
    },
    {
      id: "alkene-oxymercuration",
      name: "Oxymercuration-Demercuration",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "Hg(OAc)₂ + H₂O, then NaBH₄",
      result: "Markovnikov alcohol",
      notes: "No rearrangements",
      tags: ["alkene", "addition", "hydration", "markovnikov", "mercury"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + Hg(OAc)₂ + H₂O, then NaBH₄",
        product: "CH₃CH(OH)CH₃",
        fullReaction: "CH₃CH=CH₂ → CH₃CH(OH)CH₃ (Markovnikov, no rearrangement)",
      },
      steps: [
        {
          title: "Step 1: Mercurinium Ion Formation",
          explanation: "The alkene pi electrons attack Hg²⁺ from Hg(OAc)₂, forming a three-membered mercurinium ion (similar to halonium ion). This is a bridged intermediate that prevents rearrangement.",
          svg: () => <OxymercurationStep1 />,
          example: { reactant: "CH₃CH=CH₂ + Hg(OAc)₂", product: "Mercurinium ion", conditions: "Hg(OAc)₂" },
        },
        {
          title: "Step 2: Water Attack - Markovnikov",
          explanation: "Water attacks the more substituted carbon of the mercurinium ion, opening the ring. This gives Markovnikov regiochemistry: OH to more substituted carbon. The mercury group is on the less substituted carbon.",
          svg: () => <OxymercurationStep2 />,
          example: { reactant: "Mercurinium ion + H₂O", product: "CH₃CH(OH)CH₂HgOAc", conditions: "H₂O" },
        },
        {
          title: "Step 3: Demercuration",
          explanation: "NaBH₄ reduces the C-Hg bond, replacing mercury with hydrogen. This gives the final alcohol product with Markovnikov regiochemistry. No carbocation intermediate, so no rearrangements occur.",
          svg: () => <OxymercurationStep3 />,
          example: { reactant: "CH₃CH(OH)CH₂HgOAc", product: "CH₃CH(OH)CH₃", conditions: "NaBH₄" },
        },
      ],
    },
    {
      id: "alkene-hydrogenation",
      name: "Catalytic Hydrogenation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "H₂ + Pd, Pt, or Ni",
      result: "Alkane, syn addition",
      notes: "Syn addition of H₂, reduces alkene to alkane",
      tags: ["alkene", "reduction", "syn", "catalyst"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + H₂",
        product: "CH₃CH₂CH₃",
        fullReaction: "CH₃CH=CH₂ + H₂ → CH₃CH₂CH₃ (syn addition)",
      },
      steps: [
        {
          title: "Step 1: Alkene Adsorption",
          explanation: "The alkene adsorbs onto the metal catalyst surface (Pd, Pt, or Ni). Both faces of the alkene are in contact with the metal, allowing syn addition. The pi bond coordinates to the metal.",
          svg: createSimpleMechanismSVG("Step 1: Adsorption", "Alkene adsorbs onto metal catalyst", "CH₃CH=CH₂ + [M] → Alkene-[M] complex", "Pi bond coordinates to metal"),
          example: { reactant: "CH₃CH=CH₂ + [M]", product: "Alkene-[M] complex", conditions: "Pd, Pt, or Ni" },
        },
        {
          title: "Step 2: Syn Addition of H₂",
          explanation: "H₂ adds to the alkene from the same face (syn addition). Both hydrogens add simultaneously from the catalyst surface, giving the alkane product. The stereochemistry is syn: both H's add cis.",
          svg: createSimpleMechanismSVG("Step 2: Syn Addition", "H₂ adds from same face", "Alkene-[M] + H₂ → CH₃CH₂CH₃", "Alkane product, syn addition"),
          example: { reactant: "Alkene-[M] + H₂", product: "CH₃CH₂CH₃", conditions: "H₂, catalyst" },
        },
      ],
    },
    {
      id: "alkene-epoxidation",
      name: "Epoxidation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "mCPBA or peracid",
      result: "Epoxide, syn relative to alkene",
      notes: "Syn addition, forms three-membered epoxide ring",
      tags: ["alkene", "addition", "epoxide", "syn", "peracid"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + mCPBA",
        product: "Epoxide",
        fullReaction: "CH₃CH=CH₂ + mCPBA → Epoxide (syn)",
      },
      steps: [
        {
          title: "Step 1: Peracid Attack",
          explanation: "The peracid (RCO₃H, commonly mCPBA) attacks the alkene. The peracid oxygen adds to one carbon, and the carbonyl oxygen coordinates, forming a transition state. This is a concerted reaction.",
          svg: createSimpleMechanismSVG("Step 1: Peracid Attack", "Peracid oxygen attacks alkene", "CH₃CH=CH₂ + mCPBA → Transition state", "Concerted addition"),
          example: { reactant: "CH₃CH=CH₂ + mCPBA", product: "Transition state", conditions: "mCPBA" },
        },
        {
          title: "Step 2: Epoxide Formation",
          explanation: "The three-membered epoxide ring forms with syn stereochemistry. The oxygen adds to both carbons simultaneously from the same face. The peracid is reduced to the carboxylic acid. The product is an epoxide (oxirane).",
          svg: createSimpleMechanismSVG("Step 2: Epoxide Ring", "Three-membered ring forms", "Transition state → Epoxide + RCO₂H", "Syn addition, epoxide product"),
          example: { reactant: "Transition state", product: "Epoxide + RCO₂H", conditions: "Epoxide formation" },
        },
      ],
    },
    {
      id: "alkene-dihydroxylation",
      name: "Dihydroxylation",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "OsO₄ or cold dilute KMnO₄",
      result: "Syn diol",
      notes: "Syn addition, forms 1,2-diol (vicinal diol)",
      tags: ["alkene", "addition", "diol", "syn", "osmium"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + OsO₄",
        product: "CH₃CH(OH)CH₂OH",
        fullReaction: "CH₃CH=CH₂ + OsO₄ → CH₃CH(OH)CH₂OH (syn diol)",
      },
      steps: [
        {
          title: "Step 1: Osmium Coordination",
          explanation: "OsO₄ coordinates with the alkene, forming an osmate ester intermediate. The osmium adds to both carbons from the same face, setting up syn addition. This is a cyclic intermediate.",
          svg: createSimpleMechanismSVG("Step 1: OsO₄ Coordination", "OsO₄ coordinates with alkene", "CH₃CH=CH₂ + OsO₄ → Osmate ester", "Osmate ester intermediate"),
          example: { reactant: "CH₃CH=CH₂ + OsO₄", product: "Osmate ester", conditions: "OsO₄" },
        },
        {
          title: "Step 2: Hydrolysis to Diol",
          explanation: "Hydrolysis (H₂O or H₂O₂/NaHSO₃) converts the osmate ester to the syn diol. Both OH groups end up on the same face (syn addition). The product is a 1,2-diol (vicinal diol). Cold dilute KMnO₄ gives the same result.",
          svg: createSimpleMechanismSVG("Step 2: Hydrolysis", "Hydrolysis gives syn diol", "Osmate ester + H₂O → CH₃CH(OH)CH₂OH", "1,2-diol product, syn addition"),
          example: { reactant: "Osmate ester + H₂O", product: "CH₃CH(OH)CH₂OH", conditions: "H₂O or H₂O₂/NaHSO₃" },
        },
      ],
    },
    {
      id: "alkene-ozonolysis",
      name: "Ozonolysis",
      category: "Alkenes",
      course: "orgochem-1",
      reagents: "O₃, then DMS or Zn",
      result: "Alkene cleavage to aldehydes/ketones",
      notes: "Oxidative cleavage, breaks C=C bond",
      tags: ["alkene", "cleavage", "ozone", "aldehyde", "ketone"],
      exampleReaction: {
        reactant: "CH₃CH=CH₂ + O₃, then DMS",
        product: "CH₃CHO + HCHO",
        fullReaction: "CH₃CH=CH₂ + O₃ → CH₃CHO + HCHO (cleavage)",
      },
      steps: [
        {
          title: "Step 1: Ozonide Formation",
          explanation: "O₃ adds to the alkene, forming an initial ozonide (1,2,3-trioxolane). This is unstable and rearranges to a more stable ozonide. The alkene is fully consumed in this step.",
          svg: createSimpleMechanismSVG("Step 1: Ozonide", "O₃ adds to alkene, forms ozonide", "CH₃CH=CH₂ + O₃ → Ozonide", "Unstable intermediate"),
          example: { reactant: "CH₃CH=CH₂ + O₃", product: "Ozonide", conditions: "O₃" },
        },
        {
          title: "Step 2: Reductive Workup",
          explanation: "DMS (dimethyl sulfide) or Zn reduces the ozonide, cleaving the C=C bond. Terminal alkenes give aldehydes, internal alkenes give ketones. The two carbonyl products are formed. Oxidative workup (H₂O₂) gives carboxylic acids instead.",
          svg: createSimpleMechanismSVG("Step 2: Cleavage", "DMS or Zn cleaves ozonide", "Ozonide + DMS → CH₃CHO + HCHO", "Aldehydes/ketones from alkene cleavage"),
          example: { reactant: "Ozonide + DMS", product: "CH₃CHO + HCHO", conditions: "DMS or Zn" },
        },
      ],
    },
    {
      id: "sn2",
      name: "SN2 Substitution",
      category: "Substitution & Elimination",
      course: "orgochem-1",
      reagents: "Strong nucleophile, polar aprotic solvent",
      result: "Substitution with inversion",
      notes: "One step, backside attack, primary/secondary best",
      tags: ["substitution", "one-step", "inversion", "substitution-elimination"],
      exampleReaction: {
        reactant: "CH₃CH₂Br + OH⁻",
        product: "CH₃CH₂OH + Br⁻",
        fullReaction: "CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻",
      },
      steps: [
        {
          title: "Step 1: Backside Attack",
          explanation:
            "The nucleophile attacks from the backside (180° opposite the leaving group). Polar aprotic solvents like DMSO or acetone don't solvate the nucleophile, keeping it reactive. Primary and methyl substrates work best due to less steric hindrance.",
          svg: () => <SN2Mechanism />,
          example: {
            reactant: "CH₃CH₂Br",
            product: "CH₃CH₂OH",
            conditions: "OH⁻, DMSO",
          },
        },
      ],
    },
    {
      id: "sn1",
      name: "SN1 Substitution",
      category: "Substitution & Elimination",
      course: "orgochem-1",
      reagents: "Weak nucleophile, polar protic solvent",
      result: "Substitution with racemization",
      notes: "Two steps, carbocation intermediate, tertiary best",
      tags: ["substitution", "two-step", "carbocation", "racemization"],
      exampleReaction: {
        reactant: "(CH₃)₃CBr + H₂O",
        product: "(CH₃)₃COH + HBr",
        fullReaction: "(CH₃)₃CBr + H₂O → (CH₃)₃COH + HBr",
      },
      steps: [
        {
          title: "Step 1: Leaving Group Departs - Carbocation Formation",
          explanation: "The leaving group (X⁻) departs, forming a carbocation. This is the rate-determining step. Tertiary carbocations are most stable. The carbocation is planar (sp² hybridized), allowing attack from either face.",
          svg: createSimpleMechanismSVG("Step 1: Ionization", "Leaving group departs, carbocation forms", "(CH₃)₃CBr → (CH₃)₃C⁺ + Br⁻", "Rate-determining step, carbocation intermediate"),
          example: { reactant: "(CH₃)₃CBr", product: "(CH₃)₃C⁺ + Br⁻", conditions: "Slow step" },
        },
        {
          title: "Step 2: Nucleophile Attack",
          explanation: "The nucleophile attacks the planar carbocation from either face, giving racemic product (50:50 mixture of enantiomers). Weak nucleophiles like H₂O work well. The product forms after deprotonation if needed.",
          svg: createSimpleMechanismSVG("Step 2: Nucleophile Attack", "Nu attacks planar carbocation from either face", "(CH₃)₃C⁺ + H₂O → (CH₃)₃COH₂⁺ → (CH₃)₃COH", "Racemic product (racemization)"),
          example: { reactant: "(CH₃)₃C⁺ + H₂O", product: "(CH₃)₃COH", conditions: "Fast step, racemization" },
        },
      ],
    },
    {
      id: "e2",
      name: "E2 Elimination",
      category: "Substitution & Elimination",
      course: "orgochem-1",
      reagents: "Strong base, heat",
      result: "Alkene formation, anti-periplanar",
      notes: "One step, concerted, Zaitsev product preferred",
      tags: ["elimination", "one-step", "anti-periplanar", "zaitsev"],
      exampleReaction: {
        reactant: "CH₃CH₂CHBrCH₃ + OH⁻",
        product: "CH₃CH=CHCH₃ + H₂O + Br⁻",
        fullReaction: "CH₃CH₂CHBrCH₃ + OH⁻ → CH₃CH=CHCH₃ + H₂O + Br⁻",
      },
      steps: [
        {
          title: "Step 1: Concerted Elimination",
          explanation: "The base abstracts a β-proton while the leaving group departs simultaneously. The H and X must be anti-periplanar (180° dihedral angle). This is a one-step, concerted reaction. Zaitsev's rule: more substituted alkene is preferred.",
          svg: createSimpleMechanismSVG("Step 1: Concerted Elimination", "Base abstracts β-H, X leaves simultaneously", "CH₃CH₂CHBrCH₃ + OH⁻ → CH₃CH=CHCH₃", "Anti-periplanar, Zaitsev product"),
          example: { reactant: "CH₃CH₂CHBrCH₃ + OH⁻", product: "CH₃CH=CHCH₃", conditions: "Heat, strong base" },
        },
      ],
    },
    {
      id: "e1",
      name: "E1 Elimination",
      category: "Substitution & Elimination",
      course: "orgochem-1",
      reagents: "Weak base, heat, polar protic solvent",
      result: "Alkene formation, Zaitsev product",
      notes: "Two steps, carbocation intermediate, rearrangements possible",
      tags: ["elimination", "two-step", "carbocation", "zaitsev"],
      exampleReaction: {
        reactant: "(CH₃)₃CBr + H₂O (heat)",
        product: "(CH₃)₂C=CH₂ + HBr",
        fullReaction: "(CH₃)₃CBr + H₂O → (CH₃)₂C=CH₂ + HBr",
      },
      steps: [
        {
          title: "Step 1: Ionization - Carbocation Formation",
          explanation: "The leaving group departs, forming a carbocation (same as SN1 step 1). This is the rate-determining step. Tertiary carbocations are most stable. Rearrangements can occur if a more stable carbocation is possible.",
          svg: createSimpleMechanismSVG("Step 1: Ionization", "Leaving group departs, carbocation forms", "(CH₃)₃CBr → (CH₃)₃C⁺ + Br⁻", "Rate-determining step, carbocation intermediate"),
          example: { reactant: "(CH₃)₃CBr", product: "(CH₃)₃C⁺ + Br⁻", conditions: "Slow step" },
        },
        {
          title: "Step 2: Base Abstraction - Alkene Formation",
          explanation: "A base (often the solvent) abstracts a β-proton from the carbocation, forming the alkene. Zaitsev's rule applies: the more substituted (more stable) alkene is the major product. No stereochemical requirement (unlike E2).",
          svg: createSimpleMechanismSVG("Step 2: Base Abstraction", "Base abstracts β-H, alkene forms", "(CH₃)₃C⁺ + H₂O → (CH₃)₂C=CH₂ + H₃O⁺", "Zaitsev product, no anti-periplanar requirement"),
          example: { reactant: "(CH₃)₃C⁺ + H₂O", product: "(CH₃)₂C=CH₂", conditions: "Fast step" },
        },
      ],
    },
    {
      id: "alcohol-oxidation",
      name: "Alcohol Oxidation",
      category: "Alcohols",
      course: "orgochem-2",
      reagents: "PCC, CrO₃, or KMnO₄",
      result: "Aldehyde (1°) or ketone (2°), carboxylic acid (1° with strong oxidant)",
      notes: "Primary → aldehyde → carboxylic acid, secondary → ketone",
      tags: ["alcohol", "oxidation", "carbonyl"],
      exampleReaction: {
        reactant: "CH₃CH₂OH + PCC",
        product: "CH₃CHO",
        fullReaction: "CH₃CH₂OH + PCC → CH₃CHO (aldehyde)",
      },
      steps: [
        {
          title: "Step 1: Hydride Transfer",
          explanation: "The alcohol O-H bond is deprotonated, and the hydride (H⁻) is transferred to the oxidizing agent (Cr⁶⁺). This forms a carbonyl and reduces Cr⁶⁺ to Cr⁴⁺. For primary alcohols, this gives an aldehyde with PCC or a carboxylic acid with strong oxidants.",
          svg: createSimpleMechanismSVG("Step 1: Hydride Transfer", "H⁻ transfers to oxidant, carbonyl forms", "RCH₂OH + Cr⁶⁺ → RCHO + Cr⁴⁺", "Primary → aldehyde, secondary → ketone"),
          example: { reactant: "CH₃CH₂OH + PCC", product: "CH₃CHO", conditions: "PCC (mild oxidant)" },
        },
      ],
    },
    {
      id: "alcohol-dehydration",
      name: "Acid-Catalyzed Dehydration",
      category: "Alcohols",
      course: "orgochem-2",
      reagents: "H₂SO₄, heat",
      result: "Alkene, Zaitsev product",
      notes: "E1 mechanism, carbocation intermediate, rearrangements possible",
      tags: ["alcohol", "dehydration", "elimination", "carbocation"],
      exampleReaction: {
        reactant: "CH₃CH₂CH(OH)CH₃ + H₂SO₄",
        product: "CH₃CH=CHCH₃ + H₂O",
        fullReaction: "CH₃CH₂CH(OH)CH₃ + H₂SO₄ → CH₃CH=CHCH₃ + H₂O",
      },
      steps: [
        {
          title: "Step 1: Protonation",
          explanation: "The alcohol is protonated by H₂SO₄, forming an oxonium ion. This makes OH a better leaving group (as H₂O). The protonation is fast and reversible.",
          svg: createSimpleMechanismSVG("Step 1: Protonation", "H⁺ protonates OH, oxonium ion forms", "RCH(OH)R' + H⁺ → RCH(OH₂⁺)R'", "Makes OH a better leaving group"),
          example: { reactant: "CH₃CH₂CH(OH)CH₃ + H⁺", product: "CH₃CH₂CH(OH₂⁺)CH₃", conditions: "H₂SO₄" },
        },
        {
          title: "Step 2: Water Departs - Carbocation Formation",
          explanation: "Water departs, forming a carbocation. This is the rate-determining step (E1 mechanism). The carbocation can rearrange if a more stable one is possible (e.g., 1° → 2° or 3°).",
          svg: createSimpleMechanismSVG("Step 2: Water Departs", "H₂O leaves, carbocation forms", "RCH(OH₂⁺)R' → RCH⁺R' + H₂O", "Rate-determining step, carbocation intermediate"),
          example: { reactant: "CH₃CH₂CH(OH₂⁺)CH₃", product: "CH₃CH₂CH⁺CH₃ + H₂O", conditions: "Slow step" },
        },
        {
          title: "Step 3: Base Abstraction - Alkene Formation",
          explanation: "A base (often HSO₄⁻ or H₂O) abstracts a β-proton from the carbocation, forming the alkene. Zaitsev's rule: the more substituted alkene is the major product. Rearrangements can affect the product distribution.",
          svg: createSimpleMechanismSVG("Step 3: Base Abstraction", "Base abstracts β-H, alkene forms", "RCH⁺R' + B → RCH=CR' + BH⁺", "Zaitsev product, alkene formation"),
          example: { reactant: "CH₃CH₂CH⁺CH₃ + HSO₄⁻", product: "CH₃CH=CHCH₃", conditions: "Fast step" },
        },
      ],
    },
    {
      id: "williamson-ether",
      name: "Williamson Ether Synthesis",
      category: "Ethers & Epoxides",
      course: "orgochem-2",
      reagents: "Alkoxide + alkyl halide",
      result: "Ether",
      notes: "SN2 mechanism, primary halide best, works for symmetrical and unsymmetrical ethers",
      tags: ["ether", "synthesis", "sn2"],
      exampleReaction: {
        reactant: "CH₃CH₂O⁻ + CH₃Br",
        product: "CH₃CH₂OCH₃ + Br⁻",
        fullReaction: "CH₃CH₂O⁻ + CH₃Br → CH₃CH₂OCH₃ + Br⁻",
      },
      steps: [
        {
          title: "Step 1: SN2 Substitution",
          explanation: "The alkoxide (RO⁻) attacks the alkyl halide from the backside in an SN2 reaction. Primary halides work best. The nucleophile (alkoxide) displaces the leaving group (halide), forming the ether. Inversion of configuration occurs if the halide is chiral.",
          svg: createSimpleMechanismSVG("Step 1: SN2 Substitution", "Alkoxide attacks alkyl halide", "RO⁻ + R'X → ROR' + X⁻", "SN2 mechanism, primary halide best"),
          example: { reactant: "CH₃CH₂O⁻ + CH₃Br", product: "CH₃CH₂OCH₃ + Br⁻", conditions: "SN2, primary halide" },
        },
      ],
    },
    {
      id: "epoxide-opening",
      name: "Epoxide Ring Opening",
      category: "Ethers & Epoxides",
      course: "orgochem-2",
      reagents: "Acid or base + nucleophile",
      result: "1,2-Diol or substituted alcohol",
      notes: "Regioselectivity depends on acid vs base conditions",
      tags: ["epoxide", "ring-opening", "nucleophile"],
      exampleReaction: {
        reactant: "Epoxide + H₂O (H⁺)",
        product: "1,2-Diol",
        fullReaction: "Epoxide + H₂O → 1,2-Diol (anti addition)",
      },
      steps: [
        {
          title: "Step 1: Nucleophile Attack",
          explanation: "Under acidic conditions, the epoxide is protonated first, then the nucleophile attacks the more substituted carbon (more electrophilic). Under basic conditions, the nucleophile attacks the less substituted carbon (less steric hindrance). The ring opens, giving trans addition (anti stereochemistry).",
          svg: createSimpleMechanismSVG("Step 1: Ring Opening", "Nucleophile attacks epoxide, ring opens", "Epoxide + Nu⁻ → 1,2-substituted product", "Acid: Nu to more substituted, Base: Nu to less substituted"),
          example: { reactant: "Epoxide + H₂O (H⁺)", product: "1,2-Diol", conditions: "Acid-catalyzed, anti addition" },
        },
      ],
    },
    {
      id: "grignard-addition",
      name: "Grignard Addition to Carbonyl",
      category: "Carbonyls",
      course: "orgochem-1",
      reagents: "RMgX + carbonyl, then H₃O⁺",
      result: "Alcohol (1° from aldehyde, 2° from ketone)",
      notes: "Nucleophilic addition, irreversible, must be anhydrous",
      tags: ["carbonyl", "grignard", "nucleophilic-addition"],
      exampleReaction: {
        reactant: "CH₃CHO + CH₃MgBr, then H₃O⁺",
        product: "CH₃CH(OH)CH₃",
        fullReaction: "CH₃CHO + CH₃MgBr → CH₃CH(OH)CH₃ (2° alcohol)",
      },
      steps: [
        {
          title: "Step 1: Nucleophilic Addition",
          explanation: "The Grignard reagent (RMgX) acts as a nucleophile, attacking the electrophilic carbonyl carbon. The pi electrons move to oxygen, forming an alkoxide intermediate. This is irreversible due to the strong nucleophile.",
          svg: createSimpleMechanismSVG("Step 1: Nucleophilic Addition", "RMgX attacks carbonyl carbon", "R'C=O + RMgX → R'C(OMgX)R", "Alkoxide intermediate forms"),
          example: { reactant: "CH₃CHO + CH₃MgBr", product: "CH₃CH(OMgBr)CH₃", conditions: "Nucleophilic addition" },
        },
        {
          title: "Step 2: Protonation",
          explanation: "Acidic workup (H₃O⁺) protonates the alkoxide, giving the alcohol product. Aldehydes give primary alcohols, ketones give secondary alcohols. The reaction must be done under anhydrous conditions initially (Grignard is destroyed by water).",
          svg: createSimpleMechanismSVG("Step 2: Protonation", "H₃O⁺ protonates alkoxide", "R'C(OMgX)R + H₃O⁺ → R'C(OH)R + MgXOH", "Alcohol product forms"),
          example: { reactant: "CH₃CH(OMgBr)CH₃ + H₃O⁺", product: "CH₃CH(OH)CH₃", conditions: "Acidic workup" },
        },
      ],
    },
    {
      id: "nabh4-reduction",
      name: "Sodium Borohydride Reduction",
      category: "Carbonyls",
      course: "orgochem-1",
      reagents: "NaBH₄ + carbonyl, then H₃O⁺",
      result: "Alcohol (1° from aldehyde, 2° from ketone)",
      notes: "Mild reducing agent, works in protic solvents, selective for aldehydes/ketones",
      tags: ["carbonyl", "reduction", "nucleophilic-addition"],
      exampleReaction: {
        reactant: "CH₃COCH₃ + NaBH₄, then H₃O⁺",
        product: "CH₃CH(OH)CH₃",
        fullReaction: "CH₃COCH₃ + NaBH₄ → CH₃CH(OH)CH₃ (2° alcohol)",
      },
      steps: [
        {
          title: "Step 1: Hydride Transfer",
          explanation: "NaBH₄ provides H⁻ (hydride), which attacks the electrophilic carbonyl carbon. The pi electrons move to oxygen, forming an alkoxide. NaBH₄ is a mild reducing agent, selective for aldehydes and ketones (not carboxylic acids or esters).",
          svg: createSimpleMechanismSVG("Step 1: Hydride Transfer", "H⁻ from NaBH₄ attacks carbonyl", "R'C=O + NaBH₄ → R'C(OBH₃)Na", "Alkoxide intermediate forms"),
          example: { reactant: "CH₃COCH₃ + NaBH₄", product: "CH₃CH(OBH₃)CH₃", conditions: "Hydride transfer" },
        },
        {
          title: "Step 2: Protonation",
          explanation: "Acidic workup (H₃O⁺) protonates the alkoxide, giving the alcohol product. NaBH₄ is mild enough to use in protic solvents (unlike LiAlH₄). Aldehydes give primary alcohols, ketones give secondary alcohols.",
          svg: createSimpleMechanismSVG("Step 2: Protonation", "H₃O⁺ protonates alkoxide", "R'C(OBH₃)Na + H₃O⁺ → R'C(OH)R + B(OH)₃", "Alcohol product forms"),
          example: { reactant: "CH₃CH(OBH₃)CH₃ + H₃O⁺", product: "CH₃CH(OH)CH₃", conditions: "Acidic workup" },
        },
      ],
    },
    {
      id: "nitration",
      name: "Nitration",
      category: "Aromatic Chemistry",
      course: "orgochem-2",
      reagents: "HNO₃ + H₂SO₄",
      result: "Nitrobenzene",
      notes: "Electrophilic aromatic substitution, meta-directing",
      tags: ["aromatic", "eas", "nitration"],
      exampleReaction: {
        reactant: "C₆H₆ + HNO₃ + H₂SO₄",
        product: "C₆H₅NO₂",
        fullReaction: "C₆H₆ + HNO₃ + H₂SO₄ → C₆H₅NO₂ + H₂O",
      },
      steps: [
        {
          title: "Step 1: Electrophile Formation",
          explanation: "HNO₃ is protonated by H₂SO₄, then loses H₂O to form NO₂⁺ (nitronium ion), the electrophile. This is a strong electrophile that can attack the aromatic ring.",
          svg: createSimpleMechanismSVG("Step 1: NO₂⁺ Formation", "HNO₃ + H₂SO₄ → NO₂⁺", "HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O", "Nitronium ion (electrophile) forms"),
          example: { reactant: "HNO₃ + H₂SO₄", product: "NO₂⁺", conditions: "Electrophile formation" },
        },
        {
          title: "Step 2: Electrophilic Attack - Sigma Complex",
          explanation: "NO₂⁺ attacks the aromatic ring, forming a sigma complex (arenium ion). The aromaticity is temporarily lost. This is the rate-determining step. The positive charge is delocalized over three carbons.",
          svg: createSimpleMechanismSVG("Step 2: Sigma Complex", "NO₂⁺ attacks benzene, sigma complex forms", "C₆H₆ + NO₂⁺ → Sigma complex", "Arenium ion intermediate"),
          svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 140" role="img" aria-label="EAS curved arrows: benzene to sigma complex">
  <text x="8" y="22" font-size="13" font-weight="800" fill="#111">Curved arrows (ionic)</text>
  <polygon points="40,90 60,70 100,70 120,90 100,110 60,110" fill="none" stroke="#111" stroke-width="3"/>
  <text x="75" y="95" text-anchor="middle" font-size="11" font-weight="700">ArH</text>
  <path d="M 130 85 Q 170 40 210 85" fill="none" stroke="#007AFF" stroke-width="2.5" marker-end="url(#mE)"/>
  <defs><marker id="mE" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6z" fill="#007AFF"/></marker></defs>
  <text x="165" y="38" font-size="11" fill="#007AFF" font-weight="700">π → E⁺</text>
  <rect x="230" y="65" width="140" height="52" rx="10" fill="#fff7e6" stroke="#FF9500" stroke-width="2"/>
  <text x="300" y="96" text-anchor="middle" font-size="12" font-weight="800">σ complex (+)</text>
  <path d="M 385 88 Q 430 125 475 88" fill="none" stroke="#FF3B30" stroke-width="2.5"/>
  <text x="430" y="128" font-size="11" fill="#FF3B30" font-weight="700">B: removes H⁺</text>
  <polygon points="500,90 520,70 560,70 580,90 560,110 520,110" fill="none" stroke="#111" stroke-width="3"/>
  <text x="535" y="95" text-anchor="middle" font-size="11" font-weight="700">ArNO₂</text>
</svg>`,
          example: { reactant: "C₆H₆ + NO₂⁺", product: "Sigma complex", conditions: "Rate-determining step" },
        },
        {
          title: "Step 3: Deprotonation - Aromaticity Restored",
          explanation: "A base (often HSO₄⁻) removes a proton from the sigma complex, restoring aromaticity. The product is nitrobenzene. The NO₂ group is meta-directing and deactivating for further EAS reactions.",
          svg: createSimpleMechanismSVG("Step 3: Deprotonation", "Base removes H⁺, aromaticity restored", "Sigma complex + HSO₄⁻ → C₆H₅NO₂ + H₂SO₄", "Nitrobenzene product, meta-directing"),
          example: { reactant: "Sigma complex + HSO₄⁻", product: "C₆H₅NO₂", conditions: "Aromaticity restored" },
        },
      ],
    },
    {
      id: "friedel-crafts-alkylation",
      name: "Friedel-Crafts Alkylation",
      category: "Aromatic Chemistry",
      course: "orgochem-2",
      reagents: "RCl + AlCl₃",
      result: "Alkylbenzene",
      notes: "Electrophilic aromatic substitution, carbocation rearrangements possible",
      tags: ["aromatic", "eas", "friedel-crafts"],
      exampleReaction: {
        reactant: "C₆H₆ + CH₃CH₂Cl + AlCl₃",
        product: "C₆H₅CH₂CH₃",
        fullReaction: "C₆H₆ + CH₃CH₂Cl + AlCl₃ → C₆H₅CH₂CH₃",
      },
      steps: [
        {
          title: "Step 1: Electrophile Formation",
          explanation: "AlCl₃ coordinates with the alkyl halide, making the carbon more electrophilic. The C-X bond breaks, forming a carbocation (R⁺). Primary carbocations can rearrange to more stable ones (e.g., 1° → 2° or 3°).",
          svg: createSimpleMechanismSVG("Step 1: Carbocation Formation", "AlCl₃ forms carbocation electrophile", "RCl + AlCl₃ → R⁺ + AlCl₄⁻", "Carbocation electrophile, rearrangements possible"),
          example: { reactant: "CH₃CH₂Cl + AlCl₃", product: "CH₃CH₂⁺ + AlCl₄⁻", conditions: "Electrophile formation" },
        },
        {
          title: "Step 2: Electrophilic Attack - Sigma Complex",
          explanation: "The carbocation attacks the aromatic ring, forming a sigma complex (arenium ion). The aromaticity is temporarily lost. This is the rate-determining step. The positive charge is delocalized over three carbons.",
          svg: createSimpleMechanismSVG("Step 2: Sigma Complex", "R⁺ attacks benzene, sigma complex forms", "C₆H₆ + R⁺ → Sigma complex", "Arenium ion intermediate"),
          example: { reactant: "C₆H₆ + CH₃CH₂⁺", product: "Sigma complex", conditions: "Rate-determining step" },
        },
        {
          title: "Step 3: Deprotonation - Aromaticity Restored",
          explanation: "A base (often AlCl₄⁻) removes a proton from the sigma complex, restoring aromaticity. The product is an alkylbenzene. The alkyl group is ortho/para-directing and activating for further EAS reactions.",
          svg: createSimpleMechanismSVG("Step 3: Deprotonation", "Base removes H⁺, aromaticity restored", "Sigma complex + AlCl₄⁻ → C₆H₅R + AlCl₃ + HCl", "Alkylbenzene product, ortho/para-directing"),
          example: { reactant: "Sigma complex + AlCl₄⁻", product: "C₆H₅CH₂CH₃", conditions: "Aromaticity restored" },
        },
      ],
    },
    {
      id: "aldol-condensation",
      name: "Aldol Condensation",
      category: "Enolates",
      course: "orgochem-2",
      reagents: "Base (OH⁻ or LDA), then heat",
      result: "α,β-Unsaturated carbonyl",
      notes: "Enolate formation, then aldol addition, then dehydration",
      tags: ["enolate", "aldol", "condensation"],
      exampleReaction: {
        reactant: "2 CH₃CHO + OH⁻, then heat",
        product: "CH₃CH=CHCHO",
        fullReaction: "2 CH₃CHO + OH⁻ → CH₃CH=CHCHO (aldol condensation)",
      },
      steps: [
        {
          title: "Step 1: Enolate Formation",
          explanation: "Base (OH⁻) deprotonates the α-carbon of the aldehyde/ketone, forming an enolate. The enolate is nucleophilic at the α-carbon and can attack another carbonyl. The equilibrium favors the enolate for ketones with strong bases like LDA.",
          svg: createSimpleMechanismSVG("Step 1: Enolate Formation", "Base deprotonates α-carbon", "CH₃CHO + OH⁻ → CH₂=CHO⁻", "Enolate nucleophile forms"),
          example: { reactant: "CH₃CHO + OH⁻", product: "CH₂=CHO⁻", conditions: "Enolate formation" },
        },
        {
          title: "Step 2: Aldol Addition",
          explanation: "The enolate attacks another carbonyl molecule (self-condensation or mixed), forming an aldol addition product (β-hydroxy carbonyl). The enolate carbon attacks the electrophilic carbonyl carbon.",
          svg: createSimpleMechanismSVG("Step 2: Aldol Addition", "Enolate attacks carbonyl", "CH₂=CHO⁻ + CH₃CHO → CH₃CH(OH)CH₂CHO", "Aldol addition product (β-hydroxy carbonyl)"),
          example: { reactant: "CH₂=CHO⁻ + CH₃CHO", product: "CH₃CH(OH)CH₂CHO", conditions: "Aldol addition" },
        },
        {
          title: "Step 3: Dehydration",
          explanation: "Heat drives dehydration, removing H₂O and forming the α,β-unsaturated carbonyl (aldol condensation product). The double bond is conjugated with the carbonyl, making it stable. This is the final condensation product.",
          svg: createSimpleMechanismSVG("Step 3: Dehydration", "Heat removes H₂O, double bond forms", "CH₃CH(OH)CH₂CHO → CH₃CH=CHCHO + H₂O", "α,β-Unsaturated carbonyl (conjugated)"),
          example: { reactant: "CH₃CH(OH)CH₂CHO", product: "CH₃CH=CHCHO + H₂O", conditions: "Heat, dehydration" },
        },
      ],
    },
    {
      id: "claisen-condensation",
      name: "Claisen Condensation",
      category: "Enolates",
      course: "orgochem-2",
      reagents: "Alkoxide base (same as ester), then H₃O⁺",
      result: "β-Keto ester",
      notes: "Enolate formation, then nucleophilic acyl substitution",
      tags: ["enolate", "claisen", "ester"],
      exampleReaction: {
        reactant: "2 CH₃CO₂Et + EtO⁻, then H₃O⁺",
        product: "CH₃COCH₂CO₂Et",
        fullReaction: "2 CH₃CO₂Et + EtO⁻ → CH₃COCH₂CO₂Et (β-keto ester)",
      },
      steps: [
        {
          title: "Step 1: Enolate Formation",
          explanation: "Alkoxide base (RO⁻, same alkoxide as the ester) deprotonates the α-carbon of the ester, forming an enolate. The base must match the ester alkoxide to avoid transesterification. The enolate is nucleophilic at the α-carbon.",
          svg: createSimpleMechanismSVG("Step 1: Enolate Formation", "Alkoxide deprotonates α-carbon", "CH₃CO₂Et + EtO⁻ → CH₂=CO₂Et⁻", "Enolate nucleophile forms"),
          example: { reactant: "CH₃CO₂Et + EtO⁻", product: "CH₂=CO₂Et⁻", conditions: "Enolate formation" },
        },
        {
          title: "Step 2: Nucleophilic Acyl Substitution",
          explanation: "The enolate attacks another ester molecule at the carbonyl carbon, forming a tetrahedral intermediate. The alkoxide leaving group is expelled, giving a β-keto ester. This is a nucleophilic acyl substitution reaction.",
          svg: createSimpleMechanismSVG("Step 2: Acyl Substitution", "Enolate attacks ester carbonyl", "CH₂=CO₂Et⁻ + CH₃CO₂Et → CH₃COCH₂CO₂Et + EtO⁻", "β-Keto ester product"),
          example: { reactant: "CH₂=CO₂Et⁻ + CH₃CO₂Et", product: "CH₃COCH₂CO₂Et + EtO⁻", conditions: "Nucleophilic acyl substitution" },
        },
        {
          title: "Step 3: Acidic Workup",
          explanation: "Acidic workup (H₃O⁺) protonates any remaining enolate, giving the final β-keto ester product. The β-keto ester has an acidic α-proton (pKa ~11) and can be deprotonated for further reactions.",
          svg: createSimpleMechanismSVG("Step 3: Acidic Workup", "H₃O⁺ protonates enolate", "Enolate + H₃O⁺ → β-Keto ester", "Final β-keto ester product"),
          example: { reactant: "Enolate + H₃O⁺", product: "CH₃COCH₂CO₂Et", conditions: "Acidic workup" },
        },
      ],
    },
    {
      id: "nucleophilic-acyl-substitution",
      name: "Nucleophilic Acyl Substitution",
      category: "Carboxylic Acids & Derivatives",
      course: "orgochem-2",
      reagents: "Nucleophile + carboxylic acid derivative",
      result: "New carboxylic acid derivative",
      notes: "Tetrahedral intermediate, reactivity: acid chloride > anhydride > ester > amide",
      tags: ["carboxylic-acid", "derivative", "substitution"],
      exampleReaction: {
        reactant: "CH₃COCl + CH₃OH",
        product: "CH₃CO₂CH₃ + HCl",
        fullReaction: "CH₃COCl + CH₃OH → CH₃CO₂CH₃ + HCl",
      },
      steps: [
        {
          title: "Step 1: Nucleophilic Addition",
          explanation: "The nucleophile (Nu⁻) attacks the electrophilic carbonyl carbon, forming a tetrahedral intermediate. The pi electrons move to oxygen. This step is reversible. Acid chlorides are most reactive due to good leaving group ability.",
          svg: createSimpleMechanismSVG("Step 1: Nucleophilic Addition", "Nu attacks carbonyl, tetrahedral intermediate", "RCOX + Nu⁻ → RCO(Nu)X⁻", "Tetrahedral intermediate forms"),
          example: { reactant: "CH₃COCl + CH₃O⁻", product: "CH₃CO(OMe)Cl⁻", conditions: "Nucleophilic addition" },
        },
        {
          title: "Step 2: Leaving Group Departure",
          explanation: "The leaving group (X⁻) is expelled, reforming the carbonyl and giving the substitution product. The reactivity order depends on leaving group ability: Cl⁻ > RCOO⁻ > RO⁻ > NH₂⁻. Amides are least reactive (NH₂⁻ is a poor leaving group).",
          svg: createSimpleMechanismSVG("Step 2: Leaving Group Departure", "X⁻ leaves, carbonyl reforms", "RCO(Nu)X⁻ → RCONu + X⁻", "Substitution product forms"),
          example: { reactant: "CH₃CO(OMe)Cl⁻", product: "CH₃CO₂CH₃ + Cl⁻", conditions: "Leaving group departure" },
        },
      ],
    },
    {
      id: "reductive-amination",
      name: "Reductive Amination",
      category: "Amines",
      course: "orgochem-2",
      reagents: "Carbonyl + amine + NaBH₄ or NaBH₃CN",
      result: "Amine (primary, secondary, or tertiary)",
      notes: "Imine formation, then reduction",
      tags: ["amine", "reduction", "imine"],
      exampleReaction: {
        reactant: "CH₃CHO + NH₃ + NaBH₄",
        product: "CH₃CH₂NH₂",
        fullReaction: "CH₃CHO + NH₃ + NaBH₄ → CH₃CH₂NH₂ (primary amine)",
      },
      steps: [
        {
          title: "Step 1: Imine Formation",
          explanation: "The carbonyl reacts with the amine, forming an imine (Schiff base) intermediate. This involves nucleophilic addition of the amine to the carbonyl, followed by dehydration. The imine has a C=N double bond.",
          svg: createSimpleMechanismSVG("Step 1: Imine Formation", "Carbonyl + amine → imine", "RCHO + R'NH₂ → RCH=NR' + H₂O", "Imine intermediate forms"),
          example: { reactant: "CH₃CHO + NH₃", product: "CH₃CH=NH + H₂O", conditions: "Imine formation" },
        },
        {
          title: "Step 2: Reduction",
          explanation: "The imine is reduced by NaBH₄ or NaBH₃CN (cyanoborohydride, more selective), giving the amine product. The C=N double bond is reduced to C-N single bond. NaBH₃CN is preferred for reductive amination because it doesn't reduce the carbonyl directly.",
          svg: createSimpleMechanismSVG("Step 2: Reduction", "Imine reduced to amine", "RCH=NR' + NaBH₄ → RCH₂NHR'", "Amine product forms"),
          example: { reactant: "CH₃CH=NH + NaBH₄", product: "CH₃CH₂NH₂", conditions: "Reduction" },
        },
      ],
    },
  ];
}
