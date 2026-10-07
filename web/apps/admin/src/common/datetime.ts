import { time } from "@/models/api";
import type { DateValue } from "@internationalized/date";
import {
  CalendarDateTime,
  Time,
  fromDate,
  toCalendarDateTime,
} from "@internationalized/date";
import { formatTimeZoneLabel } from "common";
import { z } from "zod";

export const LOCALE = "en-US";
export const DAY_START = new Time(0, 0);

export type TimeRange = {
  start: DateValue;
  end: DateValue;
};

function toDate(value: DateValue, timeZone: string) {
  const { year, month, day, hour, minute } = toCalendarDateTime(value);
  return new CalendarDateTime(year, month, day, hour, minute).toDate(timeZone);
}

export function readTimeFilter(
  value: unknown,
  timeZone: string,
): TimeRange | null {
  const [condition] = (value ?? []) as { gte?: string; lte?: string }[];
  const startDate = new Date(condition?.gte ?? NaN);
  if (Number.isNaN(startDate.getTime())) {
    return null;
  }
  const rawEnd = new Date(condition?.lte ?? NaN);
  const start = fromDate(startDate, timeZone);
  const end = Number.isNaN(rawEnd.getTime())
    ? start
    : fromDate(rawEnd, timeZone);
  return { start, end: end.compare(start) < 0 ? start : end };
}

export function writeTimeFilter(
  range: TimeRange | null,
  timeZone: string,
): z.infer<typeof time> | undefined {
  if (!range) {
    return undefined;
  }
  return [
    {
      gte: toDate(range.start, timeZone),
      lte: toDate(range.end, timeZone),
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

const labelFormatters = new Map<string, Intl.DateTimeFormat>();

function getLabelFormatter(timeZone: string) {
  const cached = labelFormatters.get(timeZone);
  if (cached) {
    return cached;
  }
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  });
  labelFormatters.set(timeZone, formatter);
  return formatter;
}

export function formatTimeRange(range: TimeRange, timeZone: string) {
  const formatter = getLabelFormatter(timeZone);
  const startDate = toDate(range.start, timeZone);
  const endDate = toDate(range.end, timeZone);
  const start = `${formatter.format(startDate)} ${formatTimeZoneLabel(startDate, timeZone)}`;
  const end = `${formatter.format(endDate)} ${formatTimeZoneLabel(endDate, timeZone)}`;
  return `${start} – ${end}`;
}
