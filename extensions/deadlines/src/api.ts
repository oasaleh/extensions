import { LocalStorage } from "@raycast/api";
import crypto from "crypto";
import { DeadlineFormValues } from "./components/DeadlineForm";
import { formatISO } from "date-fns";

const LOCAL_STORAGE_KEY = "raycast-deadlines";

export type Deadline = {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string;
  icon: string;
};

function setDeadlines(deadlines: Deadline[]) {
  return LocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deadlines));
}

export async function getDeadlines() {
  const deadlines = await LocalStorage.getItem(LOCAL_STORAGE_KEY);
  return deadlines ? (JSON.parse(deadlines as string) as Deadline[]) : [];
}

export async function editDeadline(id: string, updates: DeadlineFormValues) {
  const deadlines = await getDeadlines();

  return setDeadlines(
    deadlines.map((deadline) => {
      if (deadline.id === id) {
        return {
          ...deadline,
          ...updates,
          startDate: updates.startDate ? formatISO(new Date(updates.startDate), { representation: "date" }) : null,
          endDate: formatISO(new Date(updates.endDate as Date), { representation: "date" }),
        };
      }
      return deadline;
    }),
  );
}

export async function addDeadline(values: DeadlineFormValues) {
  const deadlines = await getDeadlines();
  return setDeadlines([
    ...(deadlines ?? []),
    {
      ...values,
      id: crypto.randomUUID(),
      startDate: values.startDate ? formatISO(values.startDate as Date, { representation: "date" }) : null,
      endDate: formatISO(values.endDate as Date, { representation: "date" }),
    },
  ]);
}

export async function removeDeadline(id: string) {
  const deadlines = await getDeadlines();
  return setDeadlines(deadlines.filter((deadline) => deadline.id !== id));
}
