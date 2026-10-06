import { DateOptions, DateRange, FilterOption } from "../types";

export const convertDateFormat = (oldDate: string) => {
  if (!oldDate || Number.isNaN(new Date(oldDate).getTime())) return "N/A";
  const date = new Date(oldDate).toString().split(" ");
  const newFormat = ` ${date[2]}  ${date[1]}, ${date[3]}`;
  return newFormat;
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (!dateString || Number.isNaN(date.getTime())) return "N/A";
  const options: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  if (!dateString || Number.isNaN(date.getTime())) return "N/A";
  const options: DateOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const formatEventDate = (value?: string | null) => {
  if (!value) return "—";

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(
    date,
  );
};

export const formatEventTime = (value?: string | null) => {
  if (!value) return "—";

  const time = value.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  if (!time) return "—";

  const date = new Date(2000, 0, 1, Number(time[1]), Number(time[2]));
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatFilterDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateRange = (start: Date, end: Date): string => {
  if (start.toDateString() === end.toDateString()) {
    return formatFilterDate(start);
  }

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString("en-US", {
        month: "short",
      })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${formatFilterDate(end)}`;
  }

  return `${formatFilterDate(start)} - ${formatFilterDate(end)}`;
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const formatCreatedAt = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export const getDateRange = (
  filterType: FilterOption,
  today: Date = new Date(),
): DateRange => {
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));

  switch (filterType) {
    case "yesterday":
      const yesterday = addDays(startOfToday, -1);
      return { start: yesterday, end: yesterday };

    case "today":
      return { start: new Date(startOfToday), end: new Date(startOfToday) };

    case "last7days":
      return { start: addDays(startOfToday, -6), end: new Date(startOfToday) };

    case "thisWeek":
      return {
        start: getStartOfWeek(startOfToday),
        end: new Date(startOfToday),
      };

    case "lastWeek":
      const lastWeekEnd = addDays(getStartOfWeek(startOfToday), -1);
      return { start: getStartOfWeek(lastWeekEnd), end: lastWeekEnd };

    case "thisMonth":
      return {
        start: new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1),
        end: new Date(startOfToday),
      };

    case "lastMonth":
      const lastMonth = addMonths(startOfToday, -1);
      return {
        start: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        end: new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 0),
      };

    case "last6Months":
      const sixMonthsAgo = addMonths(startOfToday, -6);
      return {
        start: new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1),
        end: new Date(startOfToday),
      };

    case "thisYear":
      return {
        start: new Date(startOfToday.getFullYear(), 0, 1),
        end: new Date(startOfToday),
      };

    case "lastYear":
      return {
        start: new Date(startOfToday.getFullYear() - 1, 0, 1),
        end: new Date(startOfToday.getFullYear() - 1, 11, 31),
      };

    default:
      return { start: new Date(startOfToday), end: new Date(startOfToday) };
  }
};
