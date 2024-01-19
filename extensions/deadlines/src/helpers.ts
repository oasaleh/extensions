import { compareAsc, formatDistance, formatISO, isBefore } from "date-fns";
import { Deadline } from "./api";
import { partition } from "lodash";

export function formatDeadlines(deadlines: Deadline[]) {
  const [pastDeadlines, currentDeadlines] = partition(deadlines, (deadline) =>
    isBefore(deadline.endDate, getTodayInLocalTime()),
  );
  currentDeadlines.sort((a, b) => compareAsc(a.endDate, b.endDate));

  return { pastDeadlines, currentDeadlines };
}

export function getTodayInLocalTime() {
  return formatISO(new Date(), { representation: "date" });
}

export function formatDeadlineDistance(date: string) {
  const today = getTodayInLocalTime();
  if (today == date) return "Today";
  return formatDistance(date, today, { addSuffix: true });
}
