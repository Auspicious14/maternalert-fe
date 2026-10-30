import React, { useState } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useSWRConfig } from "swr";
import apiClient from "../api/client";
import { Banner, Button, Card, T } from "./ds";
import { useToast } from "./ui/ToastProvider";
import { tr } from "../services/i18n";

/**
 * Same as maternalert-web/src/components/SymptomsClearedCard.tsx.
 * Shown under the status when her latest BP is normal but her status is
 * still urgent/emergency because of symptoms she reported (they count for
 * 3 days). Explains why, and lets her say she has been checked or that the
 * symptoms have gone. Her clinic's alert stays open either way.
 */
export function SymptomsClearedCard({ bp }: { bp: { systolic: number; diastolic: number } }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useSWRConfig();
  const [choice, setChoice] = useState<"SEEN" | "BETTER" | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!choice) return;
    setBusy(true);
    try {
      await apiClient.post("/monitoring-engine/symptoms-cleared", { reason: choice });
      await Promise.all([
        mutate("/monitoring-engine/state"),
        mutate("/monitoring-engine/follow-ups"),
        queryClient.invalidateQueries({ queryKey: ["symptoms"] }),
        queryClient.invalidateQueries({ queryKey: ["care-priority"] }),
      ]);
      showToast({
        type: "success",
        message: tr({
          en: "Thank you. Your status now follows your blood pressure.",
          pcm: "Thank you. Your status go now follow your BP.",
          yo: "A dúpẹ́. Ipò rẹ yóò máa tẹ̀lé ìfúnpá rẹ báyìí.",
        }),
      });
      setChoice(null);
    } catch {
      showToast({
        type: "error",
        message: tr({
          en: "We couldn't save that. Check your internet and try again.",
          pcm: "E no save. Check your data/network, then try again.",
          yo: "Kò ṣeé fipamọ́. Ṣàyẹ̀wò íntánẹ́ẹ̀tì rẹ kí o tún gbìyànjú.",
        }),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <T variant="body">
        {tr({
          en: `Your latest blood pressure, ${bp.systolic}/${bp.diastolic}, is in the normal range. The message above is because of the symptoms you reported in the last 3 days. Those still need a health worker to check you.`,
          pcm: `Your last BP, ${bp.systolic}/${bp.diastolic}, dey normal. The message for up na because of the sickness wey you report for the last 3 days. Health worker still need check you for am.`,
          yo: `Ìfúnpá rẹ tó kẹ́yìn, ${bp.systolic}/${bp.diastolic}, dára. Ìkìlọ̀ tó wà lókè jẹ́ nítorí àwọn àìsàn tí o sọ láàrin ọjọ́ mẹ́ta sẹ́yìn. Òṣìṣẹ́ ìlera ṣì nílò láti yẹ̀ ọ́ wò.`,
        })}
      </T>

      {choice ? (
        <View style={{ gap: 12, marginTop: 14 }}>
          <Banner tone="amber">
            {tr({
              en: "Only do this if it is true. If any symptom comes back or gets worse, report it again straight away or press Emergency help.",
              pcm: "Only do am if na true. If any sickness come back or e worse, report am again sharp sharp or press Emergency help.",
              yo: "Ṣe èyí nìkan tí ó bá jẹ́ òótọ́. Tí àìsàn kankan bá padà tàbí tó burú sí i, tún sọ ọ́ lẹ́sẹ̀kẹsẹ̀ tàbí tẹ Ìrànlọ́wọ́ pàjáwìrì.",
            })}
          </Banner>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <Button onPress={confirm} loading={busy}>
              {tr({ en: "Yes, confirm", pcm: "Yes, confirm am", yo: "Bẹ́ẹ̀ni, jẹ́rìí sí i" })}
            </Button>
            <Button variant="secondary" onPress={() => setChoice(null)} disabled={busy}>
              {tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" })}
            </Button>
          </View>
        </View>
      ) : (
        <View style={{ gap: 8, marginTop: 14 }}>
          <Button variant="secondary" block onPress={() => setChoice("SEEN")}>
            {tr({ en: "A health worker has checked me", pcm: "Health worker don check me", yo: "Òṣìṣẹ́ ìlera ti yẹ̀ mí wò" })}
          </Button>
          <Button variant="secondary" block onPress={() => setChoice("BETTER")}>
            {tr({ en: "My symptoms have gone", pcm: "The sickness don comot", yo: "Àwọn àìsàn náà ti lọ" })}
          </Button>
        </View>
      )}
    </Card>
  );
}
