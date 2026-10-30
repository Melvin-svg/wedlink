/**
 * Shared, robust countdown and date calculation utilities.
 * Handles diverse date strings, timezone offsets, and non-standard time inputs (e.g. "10:30Am", "10:30 AM", "14:00").
 */

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
  totalSeconds: number;
}

export interface DaysCountdown {
  days: number;
  label: string;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Safely parses a wedding target date and optional time string into a valid Date object.
 * Supports various formats:
 * - "10:30 AM", "10:30Am", "10:30 pm", "10:30PM"
 * - 24-hour format: "14:00", "09:30"
 * - Hours only: "10 AM", "10pm"
 */
export function parseWeddingTargetDate(
  targetDate: string | Date | null | undefined,
  weddingTime?: string | null
): Date | null {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  if (isNaN(target.getTime())) return null;

  if (weddingTime && typeof weddingTime === "string") {
    const trimmed = weddingTime.trim();
    const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3]?.toLowerCase();

      if (meridiem === "pm" && hours < 12) {
        hours += 12;
      } else if (meridiem === "am" && hours === 12) {
        hours = 0;
      }

      if (!isNaN(hours) && !isNaN(minutes)) {
        target.setHours(hours, minutes, 0, 0);
      }
    }
  }

  return target;
}

/**
 * Calculates remaining days, hours, minutes, seconds until the target date.
 */
export function calculateTimeLeft(
  targetDate: string | Date | null | undefined,
  weddingTime?: string | null,
  referenceNow: Date = new Date()
): TimeLeft | null {
  const target = parseWeddingTargetDate(targetDate, weddingTime);
  if (!target) return null;

  const now = referenceNow;
  const isToday =
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate();

  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    if (isToday) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
        isToday: true,
        totalSeconds: 0,
      };
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isToday: false,
      totalSeconds: Math.floor(diffMs / 1000),
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    isToday: false,
    totalSeconds,
  };
}

/**
 * Calculates human-readable days remaining for dashboards and overview badges.
 */
export function getDaysRemaining(
  targetDate: string | Date | null | undefined,
  weddingTime?: string | null,
  referenceNow: Date = new Date()
): DaysCountdown | null {
  const target = parseWeddingTargetDate(targetDate, weddingTime);
  if (!target) return null;

  const now = referenceNow;
  const isToday =
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate();

  const diffMs = target.getTime() - now.getTime();

  if (isToday) {
    return {
      days: 0,
      label: "Today is the Day! ❤️",
      isToday: true,
      isPast: false,
    };
  }

  if (diffMs <= 0) {
    const daysAgo = Math.max(1, Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24)));
    return {
      days: daysAgo,
      label: daysAgo === 1 ? "Married yesterday" : `Married ${daysAgo} days ago`,
      isToday: false,
      isPast: true,
    };
  }

  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    days: daysLeft,
    label: daysLeft === 1 ? "1 day to go" : `${daysLeft} days to go`,
    isToday: false,
    isPast: false,
  };
}
