import { time } from "@/models/api";
import type { DateValue } from "@internationalized/date";
import {
  CalendarDateTime,
  Time,
  toCalendarDateTime,
} from "@internationalized/date";
import { z } from "zod";

export const LOCALE = "en-US";
export const DAY_START = new Time(0, 0);

export type TimeRange = {
  start: CalendarDateTime;
  end: CalendarDateTime;
};

export function toUtcDateTime(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new CalendarDateTime(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  );
}

export function toUtcDate(value: CalendarDateTime) {
  return new Date(
    Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute),
  );
}

export function readTimeFilter(value: unknown): TimeRange | null {
  const [condition] = (value ?? []) as { gte?: string; lte?: string }[];
  const start = toUtcDateTime(condition?.gte);
  if (!start) {
    return null;
  }
  const end = toUtcDateTime(condition?.lte) ?? start;
  return { start, end: end.compare(start) < 0 ? start : end };
}

export function writeTimeFilter(
  range: TimeRange | null,
): z.infer<typeof time> | undefined {
  if (!range) {
    return undefined;
  }
  return [
    {
      gte: toUtcDate(range.start),
      lte: toUtcDate(range.end),
    },
  ];
}

export function toTimeRange(
  value: {
    start: DateValue | null;
    end: DateValue | null;
  } | null,
): TimeRange | null {
  if (!value?.start || !value.end) {
    return null;
  }
  return {
    start: toCalendarDateTime(value.start),
    end: toCalendarDateTime(value.end),
  };
}

export const timeZone = "UTC";
const labelFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  timeZone,
  year: "numeric",
});

export function formatTimeRange(range: TimeRange) {
  return `${labelFormatter.format(toUtcDate(range.start))} – ${labelFormatter.format(
    toUtcDate(range.end),
  )}`;
}
