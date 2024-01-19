import { Form, ActionPanel, Action, showToast, Toast, AI, Icon, useNavigation } from "@raycast/api";
import { FormValidation, MutatePromise, useForm } from "@raycast/utils";
import * as emoji from "node-emoji";
import { Deadline, addDeadline, editDeadline } from "../api";
import { formatDeadlines } from "../helpers";

export type DeadlineFormValues = {
  title: string;
  endDate: Date | null;
  icon: string;
  startDate: Date | null;
  description: string;
};

type DeadlineFormProps = {
  deadlineToEdit?: Deadline;
  mutate?: MutatePromise<ReturnType<typeof formatDeadlines> | undefined>;
};

export function DeadlineForm({ deadlineToEdit, mutate }: DeadlineFormProps) {
  const { pop } = useNavigation();

  const { itemProps, handleSubmit, reset, focus, values, setValue } = useForm<DeadlineFormValues>({
    async onSubmit(values) {
      try {
        if (deadlineToEdit) {
          await editDeadline(deadlineToEdit.id, values);
          if (mutate) {
            await mutate();
          }
          pop();
        } else {
          await addDeadline(values);
          await showToast({ style: Toast.Style.Success, title: "Added deadline" });
          reset();
          focus("title");
        }
      } catch (error) {
        console.error(error);
        await showToast({
          style: Toast.Style.Failure,
          title: `Could not ${deadlineToEdit ? "edit" : "add"} deadline`,
        });
      }
    },
    validation: {
      title: FormValidation.Required,
      endDate: FormValidation.Required,
    },
    initialValues: {
      title: deadlineToEdit?.title,
      icon: deadlineToEdit?.icon,
      endDate: deadlineToEdit?.endDate ? new Date(deadlineToEdit.endDate) : null,
      startDate: deadlineToEdit?.startDate ? new Date(deadlineToEdit.startDate) : null,
    },
  });

  const allEmojis = emoji.search("");

  async function getEmojiSuggestion() {
    try {
      const toast = await showToast({ style: Toast.Style.Animated, title: "Searching for the perfect emoji" });
      const suggestion = await AI.ask(
        `Find only one emoji associated to this title "${values.title}". Only return the emoji character:`,
      );
      const emojiSuggestion = emoji.find(suggestion.trim());
      if (emojiSuggestion) {
        setValue("icon", emojiSuggestion.emoji);
        toast.hide();
      } else {
        await showToast({ style: Toast.Style.Failure, title: "Could not find emoji suggestion" });
      }
    } catch {
      await showToast({ style: Toast.Style.Failure, title: "Could not find emoji suggestion" });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={`${deadlineToEdit ? "Edit" : "Add"} Deadline`}
            icon={deadlineToEdit ? Icon.Pencil : Icon.Plus}
            onSubmit={handleSubmit}
          />
          <Action
            title="Get Emoji Suggestion (Pro)"
            icon={Icon.Stars}
            onAction={getEmojiSuggestion}
            shortcut={{ modifiers: ["cmd", "shift"], key: "s" }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField {...itemProps.title} title="Title" />
      <Form.DatePicker {...itemProps.endDate} title="Deadline" type={Form.DatePicker.Type.Date} />
      <Form.Dropdown {...itemProps.icon} title="Icon" info="Get an AI suggestion by pressing ⌘ + ⇧ + S">
        {allEmojis.map(({ emoji, name }) => {
          return <Form.Dropdown.Item key={emoji} title={`${emoji} ${name}`} value={emoji} />;
        })}
      </Form.Dropdown>

      <Form.Separator />

      <Form.DatePicker
        {...itemProps.startDate}
        title="Start Date"
        type={Form.DatePicker.Type.Date}
        info="Useful if you want to display the deadline with a circle progress (e.g year in progress)"
      />

      <Form.TextArea {...itemProps.description} title="Description" enableMarkdown />
    </Form>
  );
}
