import { useEffect, useRef, useCallback } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { AlertTriangle, X } from "lucide-react";

export interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  open: boolean;
  /** Dialog title shown in the header */
  title: string;
  /** Descriptive body text explaining the action */
  description: string;
  /** Label for the confirm button — defaults to "Confirm" */
  confirmLabel?: string;
  /** Label for the cancel button — defaults to "Cancel" */
  cancelLabel?: string;
  /** Whether the confirm action is in progress */
  loading?: boolean;
  /** Called when the user confirms */
  onConfirm: () => void;
  /** Called when the user cancels or presses Escape */
  onCancel: () => void;
  /** Colour variant for the confirm button */
  variant?: "danger" | "primary";
}

/**
 * ConfirmDialog — accessible modal confirmation dialog.
 * Shared by Student, University, Recruiter, and Admin portals.
 *
 * Accessibility:
 *  - role="dialog" + aria-modal + aria-labelledby + aria-describedby
 *  - Focus trapped inside while open
 *  - Escape key triggers onCancel
 *  - Cancel button receives initial focus (safe default for destructive actions)
 *  - Full dark/light theme support
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const cancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-focus the cancel button when dialog opens
  useEffect(() => {
    if (open) {
      // small delay lets the DOM paint first
      const id = setTimeout(() => cancelRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Escape to cancel + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [open, onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 shadow-rose-900/20"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-900/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className={`relative z-10 w-full max-w-md rounded-3xl border shadow-2xl animate-fade-in ${
          dark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Close ×  */}
        <button
          onClick={onCancel}
          disabled={loading}
          aria-label="Close dialog"
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 ${
            dark
              ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="p-6">
          {/* Icon + Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              aria-hidden="true"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                variant === "danger"
                  ? dark ? "bg-rose-500/15" : "bg-rose-50"
                  : dark ? "bg-blue-500/15" : "bg-blue-50"
              }`}
            >
              <AlertTriangle
                size={20}
                className={variant === "danger" ? "text-rose-500" : "text-blue-500"}
              />
            </div>
            <h2
              id="confirm-dialog-title"
              className={`text-base font-extrabold leading-snug ${
                dark ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h2>
          </div>

          {/* Body */}
          <p
            id="confirm-dialog-desc"
            className={`text-sm leading-relaxed mb-6 ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {description}
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={loading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${
                dark
                  ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cancelLabel}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg inline-flex items-center gap-2 ${confirmBtnClass}`}
            >
              {loading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  Processing…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
