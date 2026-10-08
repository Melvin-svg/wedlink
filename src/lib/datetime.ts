/**
 * Timezone-aware date & time formatting and parsing helpers.
 * Prevents UTC-vs-Local timezone drift during repeated form editing cycles.
 */

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Converts a Date or ISO string into a `YYYY-MM-DDTHH:mm` string
 * matching the wall-clock time in the given timezone (for `<input type="datetime-local" />`).
 */
export function toDateTimeLocalInput(
  date: Date | string | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}`;
  } catch {
    // Fallback if timezone string is invalid
    return d.toISOString().slice(0, 16);
  }
}

/**
 * Converts a Date or ISO string into a `YYYY-MM-DD` string
 * matching the wall-clock date in the given timezone (for `<input type="date" />`).
 */
export function toDateInput(
  date: Date | string | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/**
 * Parses a `YYYY-MM-DDTHH:mm` string into a UTC Date object
 * corresponding to that wall-clock time in the given timezone.
 */
export function parseDateTimeInZone(
  dateStr: string | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;

  const [, year, month, day, hours, minutes] = match;
  const tz = timeZone || DEFAULT_TIMEZONE;

  // Optimized fast-path for standard Indian Standard Time (+05:30)
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || tz === "IST") {
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+05:30`);
  }

  // General timezone support via Intl comparison
  try {
    const targetUtc = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
    const invFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    const parts = invFormatter.formatToParts(targetUtc);
    const p: Record<string, string> = {};
    parts.forEach((pt) => {
      p[pt.type] = pt.value;
    });
    const asInTz = new Date(
      Date.UTC(
        Number(p.year),
        Number(p.month) - 1,
        Number(p.day),
        Number(p.hour) === 24 ? 0 : Number(p.hour),
        Number(p.minute),
        Number(p.second || 0)
      )
    );
    const diff = targetUtc.getTime() - asInTz.getTime();
    return new Date(targetUtc.getTime() + diff);
  } catch {
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+05:30`);
  }
}

/**
 * Parses a `YYYY-MM-DD` date string into a Date at noon in the given timezone
 * to avoid off-by-one day bugs across timezones.
 */
export function parseDateInZone(
  dateStr: string | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  return parseDateTimeInZone(`${year}-${month}-${day}T12:00`, timeZone);
}
