"use client";

import type { TimeRange } from "@/common/datetime";
import type { LibraryFilter } from "@/models/types";
import {
  DAY_START,
  LOCALE,
  formatTimeRange,
  readTimeFilter,
  toTimeRange,
  writeTimeFilter,
} from "@/common/datetime";
import { formatTimeZoneLabel } from "common";
import { parseFilterParam } from "@/common/filter";
import { useTimeZone } from "@/hooks/useTimeZone";
import {
  CalendarDateTime,
  toCalendarDateTime,
  today,
} from "@internationalized/date";
import {
  Button,
  DateField,
  DateRangePicker,
  I18nProvider,
  Label,
  ListBox,
  RangeCalendar,
  Select,
  TimeField,
} from "@heroui/react";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";

const FIELDS = [
  { id: "createAt", label: "Created" },
  { id: "updateAt", label: "Updated" },
] as const;

const GRANULARITY = "minute";
const HOUR_CYCLE = 24;

type Field = (typeof FIELDS)[number]["id"];

type SyncState<T> = { key: string; value: T } | null;

export function TableDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const timeZone = useTimeZone();
  const filterParam = searchParams.get("filter");
  const filter = parseFilterParam<LibraryFilter>(filterParam);
  const applied =
    FIELDS.find((item) => filter[item.id] != null)?.id ?? FIELDS[0].id;
  const syncKey = `${timeZone}|${filterParam ?? ""}`;

  const [field, setField] = useState<Field>(applied);
  const [draftState, setDraftState] =
    useState<SyncState<TimeRange | null>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerSession, setPickerSession] = useState(0);

  const range = useMemo(
    () =>
      readTimeFilter(
        parseFilterParam<LibraryFilter>(filterParam)[applied],
        timeZone,
      ),
    [filterParam, applied, timeZone],
  );
  const draft = draftState?.key === syncKey ? draftState.value : range;
  const setDraft = (value: TimeRange | null) =>
    setDraftState({ key: syncKey, value });

  const label = FIELDS.find((item) => item.id === field)?.label;
  const rangeLabel = useMemo(
    () => (range ? formatTimeRange(range, timeZone) : "All time"),
    [range, timeZone],
  );
  const maxValue = useMemo(() => {
    const date = today(timeZone);
    return new CalendarDateTime(date.year, date.month, date.day, 23, 59, 59);
  }, [timeZone]);
  const zoneLabel = useMemo(
    () => formatTimeZoneLabel(new Date(), timeZone),
    [timeZone],
  );

  const apply = (nextField: Field, nextRange: TimeRange | null) => {
    const query = new URLSearchParams(searchParams);
    const filter = {
      ...parseFilterParam<LibraryFilter>(query.get("filter")),
      createAt: undefined,
      updateAt: undefined,
      [nextField]: writeTimeFilter(nextRange, timeZone),
    };
    query.set("filter", JSON.stringify([filter]));
    query.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next);
    setDraft(range);
    if (next) {
      setPickerSession((session) => session + 1);
    }
  };

  const close = () => {
    setIsOpen(false);
    setDraft(range);
  };

  const submit = (next: TimeRange | null) => {
    setDraft(next);
    setIsOpen(false);
    apply(field, next);
  };

  const clear = () => {
    setDraft(null);
    apply(field, null);
  };

  return (
    <I18nProvider locale={LOCALE}>
      <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-none">
        <DateField.Group className="w-full min-w-0 gap-1 pe-1 lg:w-auto">
          <Select
            className="w-24 shrink-0 sm:w-28 lg:w-auto"
            selectionMode="single"
            value={field}
            onChange={(key) => {
              const next = key as Field;
              setField(next);
              apply(next, range);
            }}
          >
            <Select.Trigger>
              <Select.Value className="text-sm" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {FIELDS.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.label}
                    className="pe-9"
                  >
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <DateRangePicker
            key={pickerSession}
            aria-label={`${label} time range`}
            className="min-w-0 flex-1"
            granularity={GRANULARITY}
            hideTimeZone
            hourCycle={HOUR_CYCLE}
            isOpen={isOpen}
            maxValue={maxValue}
            shouldCloseOnSelect={false}
            shouldForceLeadingZeros
            value={draft}
            onChange={(value) => setDraft(toTimeRange(value))}
            onOpenChange={handleOpenChange}
          >
            {({ state }) => {
              const startTime = state.timeRange?.start ?? DAY_START;
              const endTime = state.timeRange?.end ?? DAY_START;
              const submitDraft = () => {
                const start = state.dateRange?.start;
                const end = state.dateRange?.end;
                submit(
                  start && end
                    ? toTimeRange({
                        start: toCalendarDateTime(start, startTime),
                        end: toCalendarDateTime(end, endTime),
                      })
                    : null,
                );
              };
              return (
                <>
                  <DateRangePicker.Trigger
                    ref={triggerRef}
                    aria-label={`${label} time range`}
                    className="justify-between gap-2 px-3 text-sm"
                  >
                    <span className="truncate">{rangeLabel}</span>
                    {range ? null : <DateRangePicker.TriggerIndicator />}
                  </DateRangePicker.Trigger>
                  <DateRangePicker.Popover
                    triggerRef={triggerRef}
                    className="flex flex-col gap-3"
                  >
                    <RangeCalendar aria-label={`${label} time range`}>
                      <RangeCalendar.Header>
                        <RangeCalendar.YearPickerTrigger>
                          <RangeCalendar.YearPickerTriggerHeading />
                          <RangeCalendar.YearPickerTriggerIndicator />
                        </RangeCalendar.YearPickerTrigger>
                        <div className="flex shrink-0 items-center gap-1">
                          <RangeCalendar.NavButton slot="previous" />
                          <RangeCalendar.NavButton slot="next" />
                        </div>
                      </RangeCalendar.Header>
                      <RangeCalendar.Grid>
                        <RangeCalendar.GridHeader>
                          {(day) => (
                            <RangeCalendar.HeaderCell>
                              {day}
                            </RangeCalendar.HeaderCell>
                          )}
                        </RangeCalendar.GridHeader>
                        <RangeCalendar.GridBody>
                          {(date) => <RangeCalendar.Cell date={date} />}
                        </RangeCalendar.GridBody>
                      </RangeCalendar.Grid>
                      <RangeCalendar.YearPickerGrid>
                        <RangeCalendar.YearPickerGridBody>
                          {({ year }) => (
                            <RangeCalendar.YearPickerCell year={year} />
                          )}
                        </RangeCalendar.YearPickerGridBody>
                      </RangeCalendar.YearPickerGrid>
                    </RangeCalendar>
                    <TimeField
                      aria-label={`${label} start time`}
                      granularity={GRANULARITY}
                      hideTimeZone
                      hourCycle={HOUR_CYCLE}
                      shouldForceLeadingZeros
                      value={startTime}
                      onChange={(value) => {
                        if (value) {
                          state.setTimeRange({ start: value, end: endTime });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Label>Start time</Label>
                        <TimeField.Group variant="secondary">
                          <TimeField.Input>
                            {(segment) => (
                              <TimeField.Segment segment={segment} />
                            )}
                          </TimeField.Input>
                        </TimeField.Group>
                      </div>
                    </TimeField>
                    <TimeField
                      aria-label={`${label} end time`}
                      granularity={GRANULARITY}
                      hideTimeZone
                      hourCycle={HOUR_CYCLE}
                      shouldForceLeadingZeros
                      value={endTime}
                      onChange={(value) => {
                        if (value) {
                          state.setTimeRange({ start: startTime, end: value });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Label>End time</Label>
                        <TimeField.Group variant="secondary">
                          <TimeField.Input>
                            {(segment) => (
                              <TimeField.Segment segment={segment} />
                            )}
                          </TimeField.Input>
                        </TimeField.Group>
                      </div>
                    </TimeField>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted text-xs">{zoneLabel}</span>
                      <div className="flex gap-2">
                        <Button variant="tertiary" onPress={close}>
                          Cancel
                        </Button>
                        <Button variant="primary" onPress={submitDraft}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </DateRangePicker.Popover>
                </>
              );
            }}
          </DateRangePicker>
          {range ? (
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="shrink-0"
              aria-label={`Clear ${label} time range`}
              onPress={clear}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </DateField.Group>
      </div>
    </I18nProvider>
  );
}
