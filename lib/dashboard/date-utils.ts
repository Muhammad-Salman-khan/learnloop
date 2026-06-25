// Tiny date helpers used by dashboard demo data.
// Demo data pins "today" to a fixed date so absolute intervals stay stable
// between renders and across the day.

const REFERENCE_NOW = new Date("2026-06-25T09:00:00Z");

export function relativeTime(iso: string): string {
  const target = new Date(iso).getTime();
  const diffMs = REFERENCE_NOW.getTime() - target;
  const absMs = Math.abs(diffMs);

  const minutes = Math.round(absMs / 60_000);
  if (minutes < 1) return "Just now";

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return diffMs >= 0
      ? `${hours}h ago`
      : `in ${hours}h`;
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return diffMs >= 0
      ? `${days}d ago`
      : `in ${days}d`;
  }

  const weeks = Math.round(days / 7);
  if (weeks < 5) {
    return diffMs >= 0
      ? `${weeks}w ago`
      : `in ${weeks}w`;
  }

  const months = Math.round(days / 30);
  return diffMs >= 0
    ? `${months}mo ago`
    : `in ${months}mo`;
}

export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
