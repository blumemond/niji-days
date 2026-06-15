import { describe, expect, it } from "vitest";
import { livers } from "../data/livers";
import { addYears } from "./date";
import { calculateDayNumber, getEventsOnDate, getUpcomingAnniversaries } from "./anniversaries";

const today = "2026-06-15";

describe("anniversary calculations", () => {
  it("treats debut day as day 1", () => {
    expect(calculateDayNumber("2026-06-15", today)).toBe(1);
  });

  it("detects hundred, repeating, thousand, and special milestones", () => {
    expect(getEventsOnDate(livers[0], today).map((event) => event.label)).toContain("300日記念");
    expect(getEventsOnDate(livers[1], today).map((event) => event.label)).toContain("333日記念");
    expect(getEventsOnDate(livers[2], today).map((event) => event.label)).toContain("1,000日記念");
    expect(getEventsOnDate(livers[3], today).map((event) => event.label)).toContain("2,434日記念");
  });

  it("returns upcoming events in date order", () => {
    const events = getUpcomingAnniversaries(livers, today, 30);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].daysUntil).toBeGreaterThanOrEqual(0);
  });

  it("uses February 28 for leap-day anniversaries in non-leap years", () => {
    expect(addYears("2024-02-29", 1)).toBe("2025-02-28");
  });
});
