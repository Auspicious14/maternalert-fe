import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import { AppHeader, Banner, Button, Page, StatusHero, Steps, T, prettySymptom } from "../components/ds";
import { useCarePriority } from "../hooks/useCarePriority";
import { useLang } from "../hooks/useLang";
import { tx } from "../services/pidgin";
import { symptomResultCopy } from "../services/patientCopy";

// Same screen as maternalert-web/src/app/(patient)/symptom-results/page.tsx

export default function SymptomResultsScreen() {
  const params = useLocalSearchParams<{ msg?: string; s?: string }>();
  const reported = (params.s ?? "").split(",").filter(Boolean);
  const { data: priority } = useCarePriority();
  const lang = useLang();
  const copy = symptomResultCopy("routine");
  // The server's message is English; in Pidgin show our own wording.
  const message = lang === "en" ? params.msg || copy.message : copy.message;

  // Care priority looks at everything (BP history too), not just this check.
  const escalated = priority?.priority === "EMERGENCY" || priority?.priority === "URGENT_REVIEW";

  return (
    <Page>
      <AppHeader title={tx("Symptoms sent")} />

      <StatusHero tone="green" kicker={copy.kicker} title={copy.title} message={message} icon="checkmark-circle-outline" />

      {escalated ? (
        <Banner tone={priority?.priority === "EMERGENCY" ? "red" : "amber"}>
          {`${(lang === "en" && priority?.message) || tx("Looking at your recent readings too, you should see a health worker soon.")}${
            priority?.reasons?.length ? ` (${priority.reasons.join(", ")})` : ""
          }`}
        </Banner>
      ) : null}

      {reported.length ? <T>{tx("You reported: {list}.", { list: reported.map((s) => tx(prettySymptom(s))).join(", ") })}</T> : null}

      <Steps steps={copy.steps} />

      <View style={{ gap: 10 }}>
        <Button block size="lg" href="/(tabs)">
          {tx("Back to home")}
        </Button>
        <Button block variant="secondary" href="/bp-entry">
          {tx("Log blood pressure")}
        </Button>
        {escalated ? (
          <Button block variant="secondary" href="/clinic-finder">
            {tx("Find a clinic")}
          </Button>
        ) : null}
      </View>
    </Page>
  );
}
