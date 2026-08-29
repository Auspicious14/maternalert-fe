/**
 * __tests__/pregnancyWeek.test.ts
 *
 * Tests for the pregnancy week calculation to guard against regressions.
 *
 * ROOT CAUSE VERIFIED:
 * The 29→30 bug occurred because the old code used `createdAt` as the
 * reference date and compared UTC milliseconds. A user in WAT (UTC+1)
 * registering at 29 weeks at 23:55 WAT would have a createdAt of 22:55 UTC
 * on the same UTC day. The next morning at 00:05 WAT (= 23:05 UTC previous day)
 * the UTC "days elapsed" could be 0 or 1 depending on rounding, causing the
 * week to incorrectly advance.
 *
 * The fix uses local calendar date comparison (not UTC timestamps) and
 * pregnancyReferenceDate (not createdAt) as the anchor.
 */

import {
  buildPregnancyTimeline,
  calculateCurrentWeek,
  calendarDaysElapsed,
  getTrimester,
  getTrimesterLabel,
  weeksSinceReference,
  calculateEDD,
} from "../services/pregnancyTimeline";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function hoursAgo(h: number): Date {
  const d = new Date();
  d.setTime(d.getTime() - h * 60 * 60 * 1000);
  return d;
}

// ─── calendarDaysElapsed ──────────────────────────────────────────────────────

describe("calendarDaysElapsed", () => {
  it("returns 0 when from and to are the same local date", () => {
    const d = new Date(2024, 5, 15, 10, 0, 0);
    const d2 = new Date(2024, 5, 15, 23, 59, 59);
    expect(calendarDaysElapsed(d, d2)).toBe(0);
  });

  it("returns 1 for adjacent calendar days regardless of hour", () => {
    const from = new Date(2024, 5, 15, 23, 55, 0); // 15 June 23:55
    const to = new Date(2024, 5, 16, 0, 5, 0); // 16 June 00:05
    expect(calendarDaysElapsed(from, to)).toBe(1);
  });

  it("returns 7 for exactly 7 calendar days", () => {
    const from = new Date(2024, 5, 1);
    const to = new Date(2024, 5, 8);
    expect(calendarDaysElapsed(from, to)).toBe(7);
  });

  it("returns 0 for a same-day registration even if hours differ", () => {
    // Simulates morning registration: ref = 08:00, now = 23:55 same day
    const from = new Date(2024, 5, 15, 8, 0);
    const to = new Date(2024, 5, 15, 23, 55);
    expect(calendarDaysElapsed(from, to)).toBe(0);
  });
});

// ─── weeksSinceReference ──────────────────────────────────────────────────────

describe("weeksSinceReference", () => {
  it("returns 0 when reference was today", () => {
    expect(weeksSinceReference(new Date())).toBe(0);
  });

  it("returns 0 when only 6 days have elapsed", () => {
    expect(weeksSinceReference(daysAgo(6))).toBe(0);
  });

  it("returns 1 when exactly 7 days have elapsed", () => {
    expect(weeksSinceReference(daysAgo(7))).toBe(1);
  });

  it("returns 1 when 6 days and 23 hours have elapsed (not yet 7 full days)", () => {
    // 6 days ago = 6 calendar days. weeksSinceReference uses calendarDays, so:
    // calendarDaysElapsed(6 days ago, today) = 6 → floor(6/7) = 0
    const ref = daysAgo(6);
    expect(weeksSinceReference(ref)).toBe(0);
  });

  it("returns 0 for a future reference date", () => {
    expect(weeksSinceReference(daysFromNow(3))).toBe(0);
  });

  it("returns correct weeks for 4 weeks elapsed", () => {
    expect(weeksSinceReference(daysAgo(28))).toBe(4);
  });

  it("returns correct weeks for 13 weeks elapsed", () => {
    expect(weeksSinceReference(daysAgo(91))).toBe(13);
  });
});

// ─── calculateCurrentWeek ─────────────────────────────────────────────────────

describe("calculateCurrentWeek", () => {
  const today = new Date();

  it("returns stored week when reference is today (no progression)", () => {
    expect(calculateCurrentWeek(29, today.toISOString())).toBe(29);
  });

  it("returns 29 at 6 days elapsed (not yet 7-day boundary)", () => {
    const ref = daysAgo(6);
    expect(calculateCurrentWeek(29, ref.toISOString())).toBe(29);
  });

  it("returns 30 at exactly 7 days elapsed", () => {
    const ref = daysAgo(7);
    expect(calculateCurrentWeek(29, ref.toISOString())).toBe(30);
  });

  it("handles registration at 0 weeks", () => {
    expect(calculateCurrentWeek(0, today.toISOString())).toBe(0);
  });

  it("caps at 42 weeks", () => {
    const veryOldRef = daysAgo(365);
    expect(calculateCurrentWeek(40, veryOldRef.toISOString())).toBe(42);
  });

  it("returns stored week when no reference date provided", () => {
    expect(calculateCurrentWeek(29, null)).toBe(29);
    expect(calculateCurrentWeek(29, undefined)).toBe(29);
  });

  it("returns stored week when reference date is invalid", () => {
    expect(calculateCurrentWeek(29, "not-a-date")).toBe(29);
  });

  it("clamps to 0 for future reference date", () => {
    const futureRef = daysFromNow(10);
    // storedWeeks=5, future ref means 0 weeks elapsed → result = 5
    expect(calculateCurrentWeek(5, futureRef.toISOString())).toBe(5);
  });

  it("handles multi-week app absence correctly", () => {
    // User registered at 20 weeks, app reopened after 8 weeks
    const ref = daysAgo(56); // 8 weeks × 7 days
    expect(calculateCurrentWeek(20, ref.toISOString())).toBe(28);
  });

  it("handles exactly 6 days 23 hours — does NOT advance week", () => {
    // 6 days and 23 hours ago (in milliseconds)
    const ms = 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000;
    const ref = new Date(Date.now() - ms);
    // calendarDaysElapsed should be 6 → floor(6/7) = 0 → same week
    expect(calculateCurrentWeek(29, ref.toISOString())).toBe(29);
  });

  it("does not mutate original stored weeks field", () => {
    const stored = 29;
    const ref = daysAgo(7).toISOString();
    const result = calculateCurrentWeek(stored, ref);
    expect(stored).toBe(29); // stored is unchanged
    expect(result).toBe(30); // calculated week advanced
  });
});

// ─── getTrimester ─────────────────────────────────────────────────────────────

describe("getTrimester", () => {
  it("returns 1 for weeks 1–12", () => {
    for (let w = 1; w <= 12; w++) {
      expect(getTrimester(w)).toBe(1);
    }
  });

  it("returns 2 for weeks 13–27", () => {
    for (let w = 13; w <= 27; w++) {
      expect(getTrimester(w)).toBe(2);
    }
  });

  it("returns 3 for weeks 28–42", () => {
    for (let w = 28; w <= 42; w++) {
      expect(getTrimester(w)).toBe(3);
    }
  });
});

describe("getTrimesterLabel", () => {
  it("returns correct label for each trimester", () => {
    expect(getTrimesterLabel(1)).toBe("First Trimester");
    expect(getTrimesterLabel(12)).toBe("First Trimester");
    expect(getTrimesterLabel(13)).toBe("Second Trimester");
    expect(getTrimesterLabel(27)).toBe("Second Trimester");
    expect(getTrimesterLabel(28)).toBe("Third Trimester");
    expect(getTrimesterLabel(42)).toBe("Third Trimester");
  });
});

// ─── buildPregnancyTimeline ───────────────────────────────────────────────────

describe("buildPregnancyTimeline", () => {
  it("returns correct timeline for week 29 registered today", () => {
    const timeline = buildPregnancyTimeline(29, new Date().toISOString());
    expect(timeline.currentWeek).toBe(29);
    expect(timeline.trimester).toBe(3);
    expect(timeline.trimesterLabel).toBe("Third Trimester");
    expect(timeline.weeksRemaining).toBe(11);
    expect(timeline.isOverdue).toBe(false);
    expect(timeline.isValid).toBe(true);
    expect(timeline.progressLabel).toBe("29 weeks pregnant");
  });

  it("advances to week 30 after 7 days", () => {
    const ref = daysAgo(7);
    const timeline = buildPregnancyTimeline(29, ref.toISOString());
    expect(timeline.currentWeek).toBe(30);
    expect(timeline.trimester).toBe(3);
  });

  it("marks isValid false when reference date is missing", () => {
    const timeline = buildPregnancyTimeline(29, null);
    expect(timeline.isValid).toBe(false);
  });

  it("caps at 42 weeks", () => {
    const oldRef = daysAgo(300);
    const timeline = buildPregnancyTimeline(40, oldRef.toISOString());
    expect(timeline.currentWeek).toBe(42);
  });

  it("returns correct progressLabel", () => {
    expect(
      buildPregnancyTimeline(1, new Date().toISOString()).progressLabel,
    ).toBe("1 week pregnant");
    expect(
      buildPregnancyTimeline(20, new Date().toISOString()).progressLabel,
    ).toBe("20 weeks pregnant");
  });
});

// ─── calculateEDD ─────────────────────────────────────────────────────────────

describe("calculateEDD", () => {
  it("calculates EDD as 40 - storedWeeks from reference date", () => {
    const ref = new Date(2024, 0, 1); // 1 Jan 2024
    const edd = calculateEDD(29, ref);
    // 40 - 29 = 11 weeks = 77 days from ref
    const expected = new Date(2024, 0, 1);
    expected.setDate(expected.getDate() + 77);
    expect(edd.toDateString()).toBe(expected.toDateString());
  });
});

// ─── API / UI consistency ─────────────────────────────────────────────────────

describe("API and UI consistency", () => {
  it("UI week matches API pregnancyWeeks when registered today", () => {
    const apiWeeks = 29; // what the backend would return
    const refDate = new Date().toISOString(); // backend sets this on create

    // The UI calculation using our new service:
    const uiWeeks = calculateCurrentWeek(apiWeeks, refDate);

    // Must match — no premature inflation
    expect(uiWeeks).toBe(apiWeeks);
  });

  it("UI week advances by 1 only after 7 full calendar days", () => {
    const apiWeeks = 29;
    const refDate = daysAgo(7).toISOString();

    const uiWeeks = calculateCurrentWeek(apiWeeks, refDate);
    expect(uiWeeks).toBe(30); // correct progression
  });

  it("createdAt offset does NOT inflate week (regression guard)", () => {
    // OLD BUG: using createdAt at 23:55 would inflate the week.
    // NEW CODE: uses pregnancyReferenceDate and calendar days.
    // Simulate: reference was 23:55 last night, now is 00:05 today.
    // calendarDaysElapsed = 1 (different calendar date) but < 7 days
    const refLastNight = new Date();
    refLastNight.setHours(23, 55, 0, 0);
    refLastNight.setDate(refLastNight.getDate() - 1); // yesterday 23:55

    const today0005 = new Date();
    today0005.setHours(0, 5, 0, 0); // today 00:05

    // calendarDaysElapsed = 1 day, weeksSince = floor(1/7) = 0
    const days = calendarDaysElapsed(refLastNight, today0005);
    expect(days).toBe(1);

    const weeksElapsed = Math.floor(days / 7);
    expect(weeksElapsed).toBe(0); // no week advancement

    const uiWeeks = calculateCurrentWeek(
      29,
      refLastNight.toISOString(),
      today0005,
    );
    expect(uiWeeks).toBe(29); // must NOT show 30
  });
});
