import { useCachedPromise } from "@raycast/utils";
import { MenuBarExtra, Clipboard } from "@raycast/api";
import { getDeadlines } from "./api";
import { formatDeadlineDistance, formatDeadlines } from "./helpers";

export default function MyDeadlines() {
  const { data, isLoading } = useCachedPromise(async () => {
    const deadlines = await getDeadlines();
    return formatDeadlines(deadlines);
  });

  const deadlines = data?.currentDeadlines ?? [];

  return (
    <MenuBarExtra
      title={
        deadlines.length > 0
          ? `${deadlines[0].icon} ${deadlines[0].title} (${formatDeadlineDistance(deadlines[0].endDate)})`
          : "No Deadlines"
      }
      isLoading={isLoading}
    >
      {deadlines.map(({ id, icon, title, endDate }) => {
        return (
          <MenuBarExtra.Item
            key={id}
            icon={icon}
            title={title}
            subtitle={formatDeadlineDistance(endDate)}
            onAction={() => Clipboard.copy(endDate)}
          />
        );
      })}
    </MenuBarExtra>
  );
}
