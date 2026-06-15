import { specialDayMilestones } from "../data/livers";
import type { AnniversaryEvent, DecoratedAnniversaryEvent, Liver } from "../types";
import { addDays, addMonths, addYears, differenceInCalendarDays } from "./date";

export function calculateDayNumber(debutDate: string, targetDate: string): number {
  return differenceInCalendarDays(targetDate, debutDate) + 1;
}

export function getEventsOnDate(liver: Liver, targetDate: string): AnniversaryEvent[] {
  const dayNumber = calculateDayNumber(liver.debutDate, targetDate);
  if (dayNumber < 1) {
    return [];
  }

  const events: AnniversaryEvent[] = [];
  events.push(...getDayMilestoneEvents(liver.id, targetDate, dayNumber));
  events.push(...getCalendarMilestoneEvents(liver, targetDate, dayNumber));

  return events.sort((a, b) => a.priority - b.priority);
}

export function getPrimaryEvent(events: AnniversaryEvent[]): AnniversaryEvent | undefined {
  return [...events].sort((a, b) => a.priority - b.priority)[0];
}

export function getUpcomingAnniversaries(
  livers: Liver[],
  today: string,
  horizonDays = 30
): DecoratedAnniversaryEvent[] {
  const events: DecoratedAnniversaryEvent[] = [];

  for (const liver of livers) {
    for (let offset = 0; offset <= horizonDays; offset += 1) {
      const date = addDays(today, offset);
      for (const event of getEventsOnDate(liver, date)) {
        events.push({ ...event, liver, daysUntil: offset });
      }
    }
  }

  return dedupeEvents(events).sort((a, b) => {
    if (a.daysUntil !== b.daysUntil) {
      return a.daysUntil - b.daysUntil;
    }

    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return a.liver.displayNameKana.localeCompare(b.liver.displayNameKana, "ja");
  });
}

export function getNextAnniversary(
  liver: Liver,
  today: string,
  horizonDays = 420
): DecoratedAnniversaryEvent | undefined {
  return getUpcomingAnniversaries([liver], today, horizonDays)[0];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function getDayMilestoneEvents(
  liverId: string,
  date: string,
  dayNumber: number
): AnniversaryEvent[] {
  const events: AnniversaryEvent[] = [];

  if (dayNumber >= 1000 && dayNumber % 1000 === 0) {
    events.push(createEvent(liverId, "thousand-day", date, dayNumber, `${formatNumber(dayNumber)}日記念`, 3));
  } else if (dayNumber >= 100 && dayNumber % 100 === 0) {
    events.push(createEvent(liverId, "hundred-day", date, dayNumber, `${formatNumber(dayNumber)}日記念`, 4));
  }

  if (dayNumber >= 100 && hasRepeatingDigits(dayNumber)) {
    events.push(createEvent(liverId, "repeating-day", date, dayNumber, `${formatNumber(dayNumber)}日記念`, 5));
  }

  if (specialDayMilestones.includes(dayNumber)) {
    events.push(createEvent(liverId, "special-day", date, dayNumber, `${formatNumber(dayNumber)}日記念`, 2));
  }

  return events;
}

function getCalendarMilestoneEvents(
  liver: Liver,
  targetDate: string,
  dayNumber: number
): AnniversaryEvent[] {
  const events: AnniversaryEvent[] = [];
  const maxYears = Math.max(1, Math.ceil(dayNumber / 365) + 1);

  for (let year = 1; year <= maxYears; year += 1) {
    if (addYears(liver.debutDate, year) === targetDate) {
      events.push(createEvent(liver.id, "yearly", targetDate, dayNumber, `${year}周年`, 1));
    }
  }

  for (let year = 0; year <= maxYears; year += 1) {
    if (addMonths(liver.debutDate, year * 12 + 6) === targetDate) {
      const label = year === 0 ? "半周年" : `${year}周年半`;
      events.push(createEvent(liver.id, "half-year", targetDate, dayNumber, label, 6));
    }
  }

  return events;
}

function createEvent(
  liverId: string,
  type: AnniversaryEvent["type"],
  date: string,
  dayNumber: number,
  label: string,
  priority: number
): AnniversaryEvent {
  return { liverId, type, date, dayNumber, label, priority };
}

function hasRepeatingDigits(value: number): boolean {
  const digits = String(value);
  return digits.length >= 3 && [...digits].every((digit) => digit === digits[0]);
}

function dedupeEvents(events: DecoratedAnniversaryEvent[]): DecoratedAnniversaryEvent[] {
  const map = new Map<string, DecoratedAnniversaryEvent>();

  for (const event of events) {
    const key = `${event.liverId}:${event.date}:${event.type}:${event.label}`;
    map.set(key, event);
  }

  return [...map.values()];
}
