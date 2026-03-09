export function todayKey(): string {
  return formatDateKey(new Date());
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBefore(dateKey: string, n: number): string {
  const d = parseDate(dateKey);
  d.setDate(d.getDate() - n);
  return formatDateKey(d);
}

export function recentDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function displayDate(dateKey: string): string {
  const d = parseDate(dateKey);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
