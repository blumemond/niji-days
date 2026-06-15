export const JST_TIME_ZONE = "Asia/Tokyo";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayInJst(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Failed to format current date in JST.");
  }

  return `${year}-${month}-${day}`;
}

export function differenceInCalendarDays(date: string, baseDate: string): number {
  return Math.round((dateToUtcTime(date) - dateToUtcTime(baseDate)) / MS_PER_DAY);
}

export function addDays(date: string, days: number): string {
  return formatUtcDate(dateToUtcTime(date) + days * MS_PER_DAY);
}

export function addMonths(date: string, months: number): string {
  const { year, month, day } = parseDate(date);
  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const targetMonth = normalizedMonthIndex + 1;
  const clampedDay = Math.min(day, daysInMonth(targetYear, targetMonth));

  return toDateString(targetYear, targetMonth, clampedDay);
}

export function addYears(date: string, years: number): string {
  return addMonths(date, years * 12);
}

export function formatDateJa(date: string): string {
  const { year, month, day } = parseDate(date);
  return `${year}年${month}月${day}日`;
}

function dateToUtcTime(date: string): number {
  const { year, month, day } = parseDate(date);
  return Date.UTC(year, month - 1, day);
}

function formatUtcDate(time: number): string {
  const date = new Date(time);
  return toDateString(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function parseDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid date: ${date}`);
  }

  return { year, month, day };
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
