import { useCachedPromise } from "@raycast/utils";
import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { getDeadlines } from "./api";
import { formatDeadlines } from "./helpers";
import { DeadlineForm } from "./components/DeadlineForm";
import { DeadlineListItem } from "./components/DeadlineListItem";

export default function MyDeadlines() {
  const { data, isLoading, mutate } = useCachedPromise(async () => {
    const deadlines = await getDeadlines();
    return formatDeadlines(deadlines);
  });

  return (
    <List isLoading={isLoading}>
      {data?.currentDeadlines.map((deadline) => {
        return <DeadlineListItem key={deadline.id} deadline={deadline} mutate={mutate} />;
      })}

      {data && data.pastDeadlines.length > 0 ? (
        <List.Section title="Past Deadlines">
          {data?.pastDeadlines.map((deadline) => {
            return <DeadlineListItem key={deadline.id} deadline={deadline} mutate={mutate} />;
          })}
        </List.Section>
      ) : null}

      <List.EmptyView
        title="You don't have any deadlines."
        description="Create your first one by pressing ⏎"
        actions={
          <ActionPanel>
            <Action.Push title="Create New Deadline" icon={Icon.Plus} target={<DeadlineForm />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
