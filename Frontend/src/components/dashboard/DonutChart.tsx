import React, { useState } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
  color: string; // Tailwind color class name (e.g. 'text-blue-500')
  hexColor: string; // Hex color for matching hover overlays
}

interface DonutChartProps {
  data: ChartDataPoint[];
  centerTitle: string | number;
  centerSubtitle: string;
}

export default function DonutChart({ data, centerTitle, centerSubtitle }: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  let accumulatedPercentage = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 select-none">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            className="stroke-slate-100 dark:stroke-slate-800/80"
            strokeWidth="10"
          />
          {data.map((item, idx) => {
            const percentage = total > 0 ? item.value / total : 0;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength;
            const rotation = accumulatedPercentage * 360;
            
            // Advance cumulative count
            accumulatedPercentage += percentage;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={item.label}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.hexColor}
                strokeWidth={isHovered ? 12 : 10}
                strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                strokeDashoffset={circumference}
                style={{
                  transformOrigin: "50px 50px",
                  transform: `rotate(${rotation}deg)`,
                  transition: "stroke-width 0.2s ease, stroke-dashoffset 0.6s ease-out, opacity 0.2s ease",
                  opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1,
                  cursor: "pointer",
                }}
                className="animate-[draw-donut_0.8s_ease-out_forwards]"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
            {centerTitle}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
            {centerSubtitle}
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex flex-col gap-3 justify-center min-w-[140px]">
        {data.map((item, idx) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 scale-[1.03]"
                  : "border-transparent"
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.hexColor }}
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {item.value}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
