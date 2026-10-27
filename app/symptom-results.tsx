import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import { AppHeader, Banner, Button, Page, StatusHero, Steps, T, prettySymptom } from "../components/ds";
import { useCarePriority } from "../hooks/useCarePriority";
import { symptomResultCopy } from "../services/patientCopy";

// Same screen as maternalert-web/src/app/(patient)/symptom-results/page.tsx

export default function SymptomResultsScreen() {
  const params = useLocalSearchParams<{ msg?: string; s?: string }>();
  const reported = (params.s ?? "").split(",").filter(Boolean);
  const { data: priority } = useCarePriority();
  const copy = symptomResultCopy("routine");

  // Care priority looks at everything (BP history too), not just this check.
  const escalated = priority?.priority === "EMERGENCY" || priority?.priority === "URGENT_REVIEW";

  return (
    <Page>
      <AppHeader title="Symptoms sent" />

      <StatusHero tone="green" kicker={copy.kicker} title={copy.title} message={params.msg || copy.message} icon="checkmark-circle-outline" />

      {escalated ? (
        <Banner tone={priority?.priority === "EMERGENCY" ? "red" : "amber"}>
          {`${priority?.message || "Looking at your recent readings too, you should see a health worker soon."}${
            priority?.reasons?.length ? ` (${priority.reasons.join(", ")})` : ""
          }`}
        </Banner>
      ) : null}

      {reported.length ? <T>{`You reported: ${reported.map((s) => prettySymptom(s)).join(", ")}.`}</T> : null}

      <Steps steps={copy.steps} />

      <View style={{ gap: 10 }}>
        <Button block size="lg" href="/(tabs)">
          Back to home
        </Button>
        <Button block variant="secondary" href="/bp-entry">
          Log blood pressure
        </Button>
        {escalated ? (
          <Button block variant="secondary" href="/clinic-finder">
            Find a clinic
          </Button>
        ) : null}
      </View>
    </Page>
  );
}
