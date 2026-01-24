"use client";

import { useState, useRef, useEffect } from "react";

type DrawingTool = "bond" | "atom" | "circle" | "line" | "text" | "erase" | "clear";
type BondType = "single" | "double" | "triple";

type DrawingElement = {
  id: string;
  type: "bond" | "atom" | "circle" | "line" | "text";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  radius?: number;
  label?: string;
  bondType?: BondType;
  fontSize?: number;
};

type Props = {
  value?: string; // Base64 image data
  onChange?: (imageData: string) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
};

export default function ChemistryDrawingCanvas({ 
  value, 
  onChange, 
  disabled = false,
  width = 600,
  height = 400 
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>("bond");
  const [bondType, setBondType] = useState<BondType>("single");
  const [currentAtom, setCurrentAtom] = useState<string>("C");
  const [currentText, setCurrentText] = useState<string>("CH3");
  const [circleRadius, setCircleRadius] = useState<number>(80);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      // Load image from value if provided
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    } else {
      drawCanvas();
    }
  }, [value, elements]);

  function getCanvasCoordinates(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach((el) => {
      if (el.type === "bond" && el.x1 !== undefined && el.y1 !== undefined && el.x2 !== undefined && el.y2 !== undefined) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = el.bondType === "single" ? 3 : el.bondType === "double" ? 2 : 1;
        ctx.lineCap = "round";

        if (el.bondType === "single") {
          ctx.beginPath();
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x2, el.y2);
          ctx.stroke();
        } else if (el.bondType === "double") {
          const dx = el.x2 - el.x1;
          const dy = el.y2 - el.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const perpX = (-dy / len) * 4;
          const perpY = (dx / len) * 4;

          ctx.beginPath();
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x2, el.y2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(el.x1 + perpX, el.y1 + perpY);
          ctx.lineTo(el.x2 + perpX, el.y2 + perpY);
          ctx.stroke();
        } else if (el.bondType === "triple") {
          const dx = el.x2 - el.x1;
          const dy = el.y2 - el.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const perpX = (-dy / len) * 5;
          const perpY = (dx / len) * 5;

          ctx.beginPath();
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x2, el.y2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(el.x1 + perpX, el.y1 + perpY);
          ctx.lineTo(el.x2 + perpX, el.y2 + perpY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(el.x1 - perpX, el.y1 - perpY);
          ctx.lineTo(el.x2 - perpX, el.y2 - perpY);
          ctx.stroke();
        }
      } else if (el.type === "line" && el.x1 !== undefined && el.y1 !== undefined && el.x2 !== undefined && el.y2 !== undefined) {
        // Simple line (for Newman projection substituents)
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
      } else if (el.type === "circle" && el.x !== undefined && el.y !== undefined && el.radius !== undefined) {
        // Circle (for Newman projection)
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (el.type === "atom" && el.x !== undefined && el.y !== undefined) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(el.x, el.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (el.label) {
          ctx.fillStyle = "#000000";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(el.label, el.x, el.y);
        }
      } else if (el.type === "text" && el.x !== undefined && el.y !== undefined && el.label) {
        // Text label (for substituent labels in Newman projections)
        ctx.fillStyle = "#000000";
        ctx.font = `${el.fontSize || 14}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.label, el.x, el.y);
      }
    });

    // Draw preview if drawing
    if (isDrawing && startPos && currentPos) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const currentX = startPos.x;
      const currentY = startPos.y;
      const mouseX = currentPos.x;
      const mouseY = currentPos.y;

      if (tool === "bond" || tool === "line") {
        ctx.strokeStyle = "#007AFF";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (tool === "circle") {
        const dist = Math.sqrt((mouseX - currentX) ** 2 + (mouseY - currentY) ** 2);
        ctx.strokeStyle = "#007AFF";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(currentX, currentY, dist, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (disabled) return;
    const pos = getCanvasCoordinates(e);
    setStartPos(pos);
    setIsDrawing(true);

    if (tool === "atom") {
      const newElement: DrawingElement = {
        id: `atom-${Date.now()}`,
        type: "atom",
        x: pos.x,
        y: pos.y,
        label: currentAtom,
      };
      setElements((prev) => [...prev, newElement]);
      saveCanvas();
    } else if (tool === "text") {
      const newElement: DrawingElement = {
        id: `text-${Date.now()}`,
        type: "text",
        x: pos.x,
        y: pos.y,
        label: currentText,
        fontSize: 14,
      };
      setElements((prev) => [...prev, newElement]);
      saveCanvas();
    } else if (tool === "erase") {
      // Find and remove element at click position
      const clickedElement = elements.find((el) => {
        if (el.type === "atom" && el.x !== undefined && el.y !== undefined) {
          const dist = Math.sqrt((el.x - pos.x) ** 2 + (el.y - pos.y) ** 2);
          return dist < 20;
        } else if (el.type === "circle" && el.x !== undefined && el.y !== undefined && el.radius !== undefined) {
          const dist = Math.sqrt((el.x - pos.x) ** 2 + (el.y - pos.y) ** 2);
          return dist < el.radius + 10;
        } else if (el.type === "text" && el.x !== undefined && el.y !== undefined) {
          const dist = Math.sqrt((el.x - pos.x) ** 2 + (el.y - pos.y) ** 2);
          return dist < 30;
        }
        return false;
      });
      if (clickedElement) {
        setElements((prev) => prev.filter((el) => el.id !== clickedElement.id));
        saveCanvas();
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !startPos) return;
    const pos = getCanvasCoordinates(e);
    setCurrentPos(pos);
    
    // Redraw canvas with preview
    drawCanvas();
  }

  function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !startPos) return;
    
    const pos = getCanvasCoordinates(e);
    
    if (tool === "bond") {
      const dist = Math.sqrt((pos.x - startPos.x) ** 2 + (pos.y - startPos.y) ** 2);
      
      if (dist > 10) {
        const newElement: DrawingElement = {
          id: `bond-${Date.now()}`,
          type: "bond",
          x1: startPos.x,
          y1: startPos.y,
          x2: pos.x,
          y2: pos.y,
          bondType: bondType,
        };
        setElements((prev) => [...prev, newElement]);
        saveCanvas();
      }
    } else if (tool === "line") {
      const dist = Math.sqrt((pos.x - startPos.x) ** 2 + (pos.y - startPos.y) ** 2);
      
      if (dist > 5) {
        const newElement: DrawingElement = {
          id: `line-${Date.now()}`,
          type: "line",
          x1: startPos.x,
          y1: startPos.y,
          x2: pos.x,
          y2: pos.y,
        };
        setElements((prev) => [...prev, newElement]);
        saveCanvas();
      }
    } else if (tool === "circle") {
      const dist = Math.sqrt((pos.x - startPos.x) ** 2 + (pos.y - startPos.y) ** 2);
      
      if (dist > 10) {
        const newElement: DrawingElement = {
          id: `circle-${Date.now()}`,
          type: "circle",
          x: startPos.x,
          y: startPos.y,
          radius: dist,
        };
        setElements((prev) => [...prev, newElement]);
        saveCanvas();
      }
    }
    
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  }

  function saveCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !onChange) return;
    
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }, 100);
  }

  function clearCanvas() {
    setElements([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (onChange) {
      onChange("");
    }
  }

  useEffect(() => {
    drawCanvas();
  }, [elements, isDrawing, startPos, currentPos, tool, bondType]);

  // Helper function to create Newman projection template
  function createNewmanTemplate() {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    
    // Clear and add template
    const templateElements: DrawingElement[] = [
      {
        id: `circle-template-${Date.now()}`,
        type: "circle",
        x: centerX,
        y: centerY,
        radius: radius,
      },
      // Add guide lines for common positions (12, 3, 6, 9 o'clock)
      {
        id: `line-guide-1-${Date.now()}`,
        type: "line",
        x1: centerX,
        y1: centerY - radius - 20,
        x2: centerX,
        y2: centerY - radius - 5,
      },
      {
        id: `line-guide-2-${Date.now()}`,
        type: "line",
        x1: centerX + radius + 5,
        y1: centerY,
        x2: centerX + radius + 20,
        y2: centerY,
      },
      {
        id: `line-guide-3-${Date.now()}`,
        type: "line",
        x1: centerX,
        y1: centerY + radius + 5,
        x2: centerX,
        y2: centerY + radius + 20,
      },
      {
        id: `line-guide-4-${Date.now()}`,
        type: "line",
        x1: centerX - radius - 20,
        y1: centerY,
        x2: centerX - radius - 5,
        y2: centerY,
      },
    ];
    
    setElements(templateElements);
    saveCanvas();
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        padding: 12,
        background: "var(--panel-2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginRight: 8 }}>Tools:</div>
        
        <button
          type="button"
          onClick={() => setTool("bond")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "bond" ? "var(--blue)" : "var(--panel)",
            color: tool === "bond" ? "white" : "var(--text)",
          }}
        >
          Bond
        </button>
        
        <button
          type="button"
          onClick={() => setTool("atom")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "atom" ? "var(--blue)" : "var(--panel)",
            color: tool === "atom" ? "white" : "var(--text)",
          }}
        >
          Atom
        </button>

        <button
          type="button"
          onClick={() => setTool("circle")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "circle" ? "var(--blue)" : "var(--panel)",
            color: tool === "circle" ? "white" : "var(--text)",
          }}
        >
          Circle
        </button>

        <button
          type="button"
          onClick={() => setTool("line")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "line" ? "var(--blue)" : "var(--panel)",
            color: tool === "line" ? "white" : "var(--text)",
          }}
        >
          Line
        </button>

        <button
          type="button"
          onClick={() => setTool("text")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "text" ? "var(--blue)" : "var(--panel)",
            color: tool === "text" ? "white" : "var(--text)",
          }}
        >
          Text
        </button>

        {tool === "bond" && (
          <>
            <select
              value={bondType}
              onChange={(e) => setBondType(e.target.value as BondType)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--panel)",
              }}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </>
        )}

        {tool === "atom" && (
          <select
            value={currentAtom}
            onChange={(e) => setCurrentAtom(e.target.value)}
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--panel)",
            }}
          >
            <option value="C">C</option>
            <option value="N">N</option>
            <option value="O">O</option>
            <option value="H">H</option>
            <option value="Br">Br</option>
            <option value="Cl">Cl</option>
            <option value="F">F</option>
            <option value="I">I</option>
          </select>
        )}

        {tool === "text" && (
          <input
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Label (e.g., CH3)"
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--panel)",
              width: 120,
            }}
          />
        )}

        {tool === "circle" && (
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            Click & drag to draw circle
          </div>
        )}

        <button
          type="button"
          onClick={createNewmanTemplate}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: "var(--green)",
            color: "white",
          }}
          title="Create Newman projection template"
        >
          Newman Template
        </button>

        <button
          type="button"
          onClick={() => setTool("erase")}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            background: tool === "erase" ? "var(--red)" : "var(--panel)",
            color: tool === "erase" ? "white" : "var(--text)",
          }}
        >
          Erase
        </button>

        <button
          type="button"
          onClick={clearCanvas}
          className="btn"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            marginLeft: "auto",
          }}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          display: "block",
          cursor: disabled ? "not-allowed" : tool === "bond" || tool === "line" ? "crosshair" : tool === "atom" || tool === "text" ? "pointer" : tool === "circle" ? "crosshair" : "default",
          background: "#ffffff",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}
