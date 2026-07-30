/**
 * University Portal shared components
 *
 * Re-exports shared UI building blocks for University pages.
 * For state components (Loading/Empty/Error), we reuse the Student portal
 * components since they are theme-aware and architecture-compatible.
 */

// University-specific components
export { default as StatCard } from "./StatCard";
export { default as PageHeader } from "./PageHeader";

// Re-export Student portal state components — identical API, compatible theme
export { default as LoadingSkeleton } from "../student/LoadingSkeleton";
export { default as EmptyState } from "../student/EmptyState";
export { default as ErrorState } from "../student/ErrorState";
