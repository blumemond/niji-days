import { describe, expect, it } from "vitest";
import type { Liver } from "../types";
import { addYears } from "./date";
import { calculateDayNumber, getEventsOnDate, getUpcomingAnniversaries } from "./anniversaries";

const today = "2026-06-15";

describe("anniversary calculations", () => {
  it("treats debut day as day 1", () => {
    expect(calculateDayNumber("2026-06-15", today)).toBe(1);
  });

  it("detects hundred, repeating, thousand, and special milestones", () => {
    expect(getEventsOnDate(createLiver("2025-08-20"), today).map((event) => event.label)).toContain("300日記念");
    expect(getEventsOnDate(createLiver("2025-07-18"), today).map((event) => event.label)).toContain("333日記念");
    expect(getEventsOnDate(createLiver("2023-09-20"), today).map((event) => event.label)).toContain("1,000日記念");
    expect(getEventsOnDate(createLiver("2019-10-17"), today).map((event) => event.label)).toContain("2,434日記念");
  });

  it("returns upcoming events in date order", () => {
    const events = getUpcomingAnniversaries([createLiver("2021-01-15")], today, 30);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].daysUntil).toBeGreaterThanOrEqual(0);
  });

  it("uses February 28 for leap-day anniversaries in non-leap years", () => {
    expect(addYears("2024-02-29", 1)).toBe("2025-02-28");
  });
});

function createLiver(debutDate: string): Liver {
  return {
    id: `test-${debutDate}`,
    displayName: "テスト",
    displayNameKana: "てすと",
    debutDate,
    debutDateBasis: "test",
    branch: "JP",
    status: "active",
    color: "#13a38b",
    sourceNote: "test",
    links: []
  };
}
