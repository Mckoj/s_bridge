import { useDashboard } from "../../context/DashboardContext";

interface LoadingSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number;
  /** Layout: "list" for vertical rows, "grid" for 2-column grid */
  layout?: "list" | "grid";
}

function SkeletonCard({ dark }: { dark: boolean }) {
  return (
    <div
      className={`rounded-3xl border p-6 space-y-4 animate-pulse ${
        dark
          ? "bg-slate-900/60 border-slate-800/80"
          : "bg-white border-slate-200"
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex-shrink-0 ${
            dark ? "bg-slate-800" : "bg-slate-100"
          }`}
        />
        <div className="flex-1 space-y-2">
          <div
            className={`h-3 rounded-full w-3/4 ${
              dark ? "bg-slate-800" : "bg-slate-100"
            }`}
          />
          <div
            className={`h-2.5 rounded-full w-1/2 ${
              dark ? "bg-slate-800" : "bg-slate-100"
            }`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div
          className={`h-2.5 rounded-full w-full ${
            dark ? "bg-slate-800" : "bg-slate-100"
          }`}
        />
        <div
          className={`h-2.5 rounded-full w-5/6 ${
            dark ? "bg-slate-800" : "bg-slate-100"
          }`}
        />
      </div>
      <div
        className={`h-8 rounded-xl w-1/3 ml-auto ${
          dark ? "bg-slate-800" : "bg-slate-100"
        }`}
      />
    </div>
  );
}

export default function LoadingSkeleton({
  count = 3,
  layout = "list",
}: LoadingSkeletonProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const cards = Array.from({ length: count }, (_, i) => (
    <SkeletonCard key={i} dark={dark} />
  ));

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="status" aria-label="Loading content">
        {cards}
      </div>
    );
  }

  return (
    <div className="space-y-4" role="status" aria-label="Loading content">
      {cards}
    </div>
  );
}
