import { closeMainWindow, getPreferenceValues } from "@raycast/api";
import { runAppleScript } from "run-applescript";

export default async function Command() {
  const { alsoHideRaycast } = getPreferenceValues();

  const promises = [];

  if (alsoHideRaycast) {
    promises.push(closeMainWindow());
  }

  promises.push(runAppleScript(`
    tell application "System Events"
        set visible of processes where name is not "Finder" to false
    end tell
    tell application "Finder"
        set collapsed of windows to true
        activate
    end tell
  `));

  await Promise.all(promises);
}
