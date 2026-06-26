// Small formatter helpers used across every page under /dashboard/admin/*.
// Stick to the same conventions used by lib/dashboard/date-utils.ts so the
// look-and-feel of "12 min ago" / "Jan 2026" is identical everywhere.

// The admin demo data pins "now" to 2026-01-12. Pinning the formatter to the
// same anchor keeps absolute intervals stable between renders — exactly what
// we want while the underlying dataset is mocked.
const ANCHOR_NOW = new Date("2026-01-12T09:00:00Z");

function pickOpt(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : null;
}

export function relativeTime(iso: string | null | undefined): string {
  const target = pickOpt(iso);
  if (target === null) return "—";
  const diffMs = ANCHOR_NOW.getTime() - target;
  const absMs = Math.abs(diffMs);

  const minutes = Math.round(absMs / 60_000);
  if (minutes < 1) return diffMs >= 0 ? "Just now" : "in a moment";

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return diffMs >= 0 ? `${hours}h ago` : `in ${hours}h`;
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return diffMs >= 0 ? `${days}d ago` : `in ${days}d`;
  }

  const weeks = Math.round(days / 7);
  if (weeks < 5) {
    return diffMs >= 0 ? `${weeks}w ago` : `in ${weeks}w`;
  }

  const months = Math.round(days / 30);
  if (months < 12) {
    return diffMs >= 0 ? `${months}mo ago` : `in ${months}mo`;
  }

  const years = Math.round(days / 365);
  return diffMs >= 0 ? `${years}y ago` : `in ${years}y`;
}

export function formatDateLong(iso: string | null | undefined): string {
  const target = pickOpt(iso);
  if (target === null) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(target));
}

export function formatDateTime(iso: string | null | undefined): string {
  const target = pickOpt(iso);
  if (target === null) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(target));
}

// YYYY-MM-DD → "Jan 2026"
export function formatMonthYear(monthLabel: string): string {
  const [rawYear, rawMonth] = monthLabel.split("-");
  if (!rawYear || !rawMonth) return monthLabel;
  const year = Number.parseInt(rawYear, 10);
  const month = Number.parseInt(rawMonth, 10);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return monthLabel;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatCurrencyPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] ?? "" : "";
  const a = first.charAt(0).toUpperCase();
  const b = last.charAt(0).toUpperCase();
  return (a + b).trim();
}
