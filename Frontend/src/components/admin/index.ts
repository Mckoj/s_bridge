/**
 * Admin Portal shared components.
 *
 * Admin-specific:
 *   StatCard, PageHeader
 *
 * Shared state components (re-exported from student — identical theme API):
 *   LoadingSkeleton, EmptyState, ErrorState
 *
 * Shared cross-portal components (re-exported from common):
 *   ConfirmDialog, StatusBadge
 */

// Admin-specific
export { default as StatCard } from "./StatCard";
export { default as PageHeader } from "./PageHeader";

// Shared state components — same across all portals
export { default as LoadingSkeleton } from "../student/LoadingSkeleton";
export { default as EmptyState } from "../student/EmptyState";
export { default as ErrorState } from "../student/ErrorState";

// Shared cross-portal components
export { default as ConfirmDialog } from "../common/ConfirmDialog";
export type { ConfirmDialogProps } from "../common/ConfirmDialog";
export { default as StatusBadge } from "../common/StatusBadge";
