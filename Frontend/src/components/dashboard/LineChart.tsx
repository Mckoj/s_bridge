import React, { useState, useRef } from "react";

interface LineChartProps {
  data: number[];
  labels: string[];
  color: "blue" | "purple" | "green";
  height?: number;
}

export default function LineChart({ data, labels, color, height = 200 }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Styling settings
  const colorStyles = {
    blue: {
      stroke: "#2563eb", // blue-600
      fillGradStart: "rgba(37, 99, 235, 0.25)",
      fillGradEnd: "rgba(37, 99, 235, 0.0)",
      accentBg: "bg-blue-600",
      accentBorder: "border-blue-600",
    },
    purple: {
      stroke: "#8b5cf6", // purple-600
      fillGradStart: "rgba(139, 92, 246, 0.25)",
      fillGradEnd: "rgba(139, 92, 246, 0.0)",
      accentBg: "bg-purple-600",
      accentBorder: "border-purple-600",
    },
    green: {
      stroke: "#10b981", // emerald-500
      fillGradStart: "rgba(16, 185, 129, 0.25)",
      fillGradEnd: "rgba(16, 185, 129, 0.0)",
      accentBg: "bg-emerald-500",
      accentBorder: "border-emerald-500",
    },
  };

  const style = colorStyles[color];

  // Chart dimensions inside SVG
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const chartWidth = svgWidth - 2 * paddingX;
  const chartHeight = svgHeight - 2 * paddingY;

  // Data math
  const maxVal = Math.max(...data, 10) * 1.1; // Add 10% padding on top
  const minVal = 0;
  const range = maxVal - minVal;

  const stepX = chartWidth / (data.length - 1);

  // Generate coordinates for points
  const points = data.map((val, idx) => {
    const x = paddingX + idx * stepX;
    const y = svgHeight - paddingY - ((val - minVal) / range) * chartHeight;
    return { x, y, val, label: labels[idx] };
  });

  // Generate Bezier path string
  let pathD = "";
  let areaD = "";

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      // Control points for a smooth cubic spline
      const cp1x = p0.x + stepX / 3;
      const cp1y = p0.y;
      const cp2x = p1.x - stepX / 3;
      const cp2y = p1.y;
      
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    // Close the area path for gradient fill
    areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
  }

  // Draw grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id={`areaGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={style.fillGradStart} />
            <stop offset="100%" stopColor={style.fillGradEnd} />
          </linearGradient>
        </defs>

        {/* Grid Lines & Y Axis Labels */}
        {gridLines.map((ratio, idx) => {
          const y = paddingY + (1 - ratio) * chartHeight;
          const val = Math.round(minVal + ratio * range);
          return (
            <g key={idx} className="opacity-40 dark:opacity-20">
              <line
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-semibold fill-slate-400 dark:fill-slate-500 font-sans"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {points.map((p, idx) => (
          <text
            key={idx}
            x={p.x}
            y={svgHeight - paddingY + 18}
            textAnchor="middle"
            className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500 font-sans cursor-pointer"
            onClick={() => setHoveredIndex(idx)}
          >
            {p.label}
          </text>
        ))}

        {/* Gradient Area under Curve */}
        {areaD && (
          <path
            d={areaD}
            fill={`url(#areaGrad-${color})`}
            className="animate-[fade-in_0.6s_ease-out_forwards]"
          />
        )}

        {/* Main Bezier Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={style.stroke}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="stroke-draw animate-[draw-line_1s_ease-out_forwards]"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              transition: "stroke-dashoffset 1.2s ease-in-out",
            }}
          />
        )}

        {/* Interaction trigger zones (invisible vertical bars) */}
        {points.map((p, idx) => {
          const zoneWidth = stepX;
          return (
            <rect
              key={idx}
              x={p.x - zoneWidth / 2}
              y={paddingY}
              width={zoneWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}

        {/* Highlighting Dots */}
        {points.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g key={idx} className="pointer-events-none">
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 7 : 4}
                fill={style.stroke}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2.5 : 1.5}
                style={{
                  transition: "r 0.15s ease, stroke-width 0.15s ease",
                }}
                className="shadow-sm dark:stroke-slate-900"
              />
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="14"
                  fill={style.stroke}
                  fillOpacity="0.15"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 p-2.5 rounded-xl border bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-sm transition-all duration-150 flex flex-col gap-0.5 border-slate-100 dark:border-slate-800 pointer-events-none"
          style={{
            left: `${((points[hoveredIndex].x - paddingX) / chartWidth) * 90 + 5}%`,
            bottom: "85%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {points[hoveredIndex].label}
          </span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {points[hoveredIndex].val} {color === "blue" ? "Applications" : color === "purple" ? "Students" : "Performance"}
          </span>
        </div>
      )}
    </div>
  );
}
