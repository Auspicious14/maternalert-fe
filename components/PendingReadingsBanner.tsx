import React from "react";

import { Banner } from "./ds";
import { usePendingReadings } from "../hooks/useOfflineSync";

// Same component as maternalert-web/src/components/PendingReadingsBanner.tsx

/** Shows readings saved on this phone that haven't reached the server yet. */
export default function PendingReadingsBanner() {
  const pending = usePendingReadings();
  if (!pending.length) return null;
  const list = pending
    .slice(-3)
    .map(
      (r) =>
        `${r.systolic}/${r.diastolic} (${new Date(r.recordedAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })})`,
    )
    .join(", ");
  return (
    <Banner tone="amber" icon="cloud-offline-outline">
      {`${pending.length === 1 ? "1 reading is" : `${pending.length} readings are`} saved on this phone and waiting for internet: ${list}. They will send automatically.`}
    </Banner>
  );
}
