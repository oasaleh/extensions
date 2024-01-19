import { Action, ActionPanel, Icon, Keyboard, List } from "@raycast/api";
import { format } from "date-fns";
import { Deadline, removeDeadline } from "../api";
import { formatDeadlineDistance, formatDeadlines } from "../helpers";
import { MutatePromise } from "@raycast/utils";
import { DeadlineForm } from "./DeadlineForm";

type DeadlineListItemProps = {
  deadline: Deadline;
  mutate: MutatePromise<ReturnType<typeof formatDeadlines> | undefined>;
};

export function DeadlineListItem({ deadline, mutate }: DeadlineListItemProps) {
  return (
    <List.Item
      icon={deadline.icon}
      title={deadline.title}
      accessories={[{ text: formatDeadlineDistance(deadline.endDate), tooltip: format(deadline.endDate, "PPPP") }]}
      actions={
        <ActionPanel>
          <Action.Push
            title="Edit Deadline"
            icon={Icon.Pencil}
            shortcut={Keyboard.Shortcut.Common.Edit}
            target={<DeadlineForm deadlineToEdit={deadline} mutate={mutate} />}
          />
          <Action
            icon={Icon.Trash}
            style={Action.Style.Destructive}
            title="Delete Deadline"
            shortcut={Keyboard.Shortcut.Common.Remove}
            onAction={async () => {
              await removeDeadline(deadline.id);
              await mutate();
            }}
          />

          <ActionPanel.Section>
            <Action.CopyToClipboard title="Copy Deadline Title" content={deadline.title} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
