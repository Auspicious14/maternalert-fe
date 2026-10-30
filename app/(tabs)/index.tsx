import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "../../components/shared/Typography";
import {
  AppHeader,
  Button,
  Card,
  IconButton,
  LogoMark,
  Page,
  Pill,
  Row,
  SectionHeader,
  Skeleton,
  StatusHero,
  T,
  Tile,
  greeting,
  prettySymptom,
  timeAgo,
  useTokens,
} from "../../components/ds";
import { useHealthData } from "../../hooks/useHealthData";
import { useLang } from "../../hooks/useLang";
import { FollowUpTaskResponse, useMonitoringData } from "../../hooks/useMonitoringData";
import { useNotifications } from "../../hooks/useNotifications";
import { useUserProfile } from "../../hooks/useUserProfile";
import { getTier } from "../../services/escalation";
import { getPersonalizedGuidance } from "../../services/personalization";
import { readingLabel, statusCopy } from "../../services/patientCopy";
import {
  ALERT_SENT_MESSAGE,
  showEmergencyFallback,
  triggerEmergencyAlert,
} from "../../services/emergencyAlert";
import PendingReadingsBanner from "../../components/PendingReadingsBanner";
import { SymptomsClearedCard } from "../../components/SymptomsClearedCard";
import { useMyHistory } from "../../hooks/useMyHistory";
import { tr } from "../../services/i18n";

// ─── FLOATING EMERGENCY BUTTON ────────────────────────────────────────────────
// Rendered outside <Screen> so it stays fixed above the tab bar while the
// content scrolls underneath it.

function FloatingEmergencyButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const { profile } = useUserProfile();
  const router = useRouter();

  async function handleConfirm() {
    setTriggering(true);
    // Accept any 2xx (previously only 201, so a 200 showed "failed" even
    // though the alert went out). On failure, offer phone-based fallbacks
    // that do not depend on our server.
    const ok = await triggerEmergencyAlert();
    setTriggering(false);
    if (ok) {
      setTriggered(true);
    } else {
      setModalVisible(false);
      showEmergencyFallback(profile?.emergencyContactPhone, () =>
        router.push("/(tabs)/profile"),
      );
    }
  }

  function handleClose() {
    setModalVisible(false);
    // Reset after modal animation completes
    setTimeout(() => setTriggered(false), 300);
  }

  return (
    <>
      {/* Floating button — sits above tab bar */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          bottom: 96, // above tab bar (~56px) + breathing room
          right: 20,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: "#DC2626",
          alignItems: "center",
          justifyContent: "center",
          // Shadow
          shadowColor: "#DC2626",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 10,
          elevation: 10,
          zIndex: 100,
        }}
      >
        <Ionicons name="warning" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Confirmation / Success Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 28,
              width: "100%",
              alignItems: "center",
            }}
          >
            {triggered ? (
              // ── SUCCESS STATE ──
              <>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: "#DCFCE7",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
                </View>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  Alert Sent
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: "#64748B",
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 24,
                  }}
                >
                  {ALERT_SENT_MESSAGE}
                </Typography>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    backgroundColor: "#16A34A",
                    borderRadius: 14,
                    paddingVertical: 14,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body"
                    weight="bold"
                    style={{ color: "#fff" }}
                  >
                    OK
                  </Typography>
                </TouchableOpacity>
              </>
            ) : (
              // ── CONFIRMATION STATE ──
              <>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="warning" size={34} color="#DC2626" />
                </View>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  Send Emergency Alert?
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: "#64748B",
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 24,
                  }}
                >
                  This will immediately notify your emergency contact and health
                  facility. Only use this in a real emergency.
                </Typography>

                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={triggering}
                  style={{
                    backgroundColor: "#DC2626",
                    borderRadius: 14,
                    paddingVertical: 15,
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 10,
                    opacity: triggering ? 0.7 : 1,
                  }}
                >
                  {triggering ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Typography
                      variant="h3"
                      weight="bold"
                      style={{ color: "#fff" }}
                    >
                      Yes, Send Alert Now
                    </Typography>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClose}
                  disabled={triggering}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E6E1D9",
                    borderRadius: 14,
                    paddingVertical: 13,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body" style={{ color: "#64748B" }}>
                    Cancel
                  </Typography>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
// Same structure and wording as maternalert-web/src/app/(patient)/home/page.tsx

const HERO_ICON = {
  green: "shield-checkmark-outline",
  amber: "time-outline",
  urgent: "warning-outline",
  red: "alert-circle-outline",
} as const;

export default function HomeScreen() {
  const router = useRouter();
  const t = useTokens();
  const { monitoringState, followUpTasks, isLoadingMonitoringState, isLoadingFollowUpTasks } =
    useMonitoringData();
  const { latestBP, recentSymptoms, isLoadingLatestBP, isLoadingRecentSymptoms } = useHealthData();
  const { calculatedPregnancyWeeks } = useUserProfile();
  const { unreadCount } = useNotifications();
  const { data: myHistory } = useMyHistory();

  useLang();
  const status = statusCopy(monitoringState?.currentState);
  const guidance = useMemo(() => getPersonalizedGuidance(recentSymptoms || []), [recentSymptoms]);
  const reading = latestBP ? readingLabel(getTier(latestBP.systolic, latestBP.diastolic)) : null;
  const pendingTasks = (followUpTasks ?? []).filter((task) => task.status !== "COMPLETED");
  const lightHero = status.tone === "green" || status.tone === "amber";
  // Normal BP but still urgent/emergency: it's her recent symptoms. Say so.
  const symptomDriven =
    (monitoringState?.currentState === "EMERGENCY" || monitoringState?.currentState === "URGENT") &&
    latestBP != null &&
    getTier(latestBP.systolic, latestBP.diastolic) === 1 &&
    (recentSymptoms?.length ?? 0) > 0;

  return (
    <View style={{ flex: 1 }}>
      <Page>
        <AppHeader
          leading={<LogoMark height={34} />}
          title={greeting()}
          subtitle={calculatedPregnancyWeeks ? `Week ${calculatedPregnancyWeeks} of your pregnancy` : undefined}
          actions={
            <>
              <IconButton
                label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
                onPress={() => router.push("/notifications")}
                dot={unreadCount > 0}
              >
                <Ionicons name="notifications-outline" size={20} color={t.ink} />
              </IconButton>
              <IconButton label="Your profile" onPress={() => router.push("/(tabs)/profile")}>
                <Ionicons name="person-outline" size={20} color={t.ink} />
              </IconButton>
            </>
          }
        />

        <PendingReadingsBanner />

        {/* 1. What matters right now */}
        {isLoadingMonitoringState ? (
          <Skeleton height={190} radius={24} />
        ) : (
          <StatusHero
            tone={status.tone}
            kicker={status.kicker}
            title={status.title}
            message={monitoringState?.reason || status.fallbackMessage}
            icon={HERO_ICON[status.tone]}
            actions={
              <>
                <Button variant={lightHero ? "primary" : "white"} href={status.primary.route}>
                  {status.primary.label}
                </Button>
                {status.secondary ? (
                  <Button variant={lightHero ? "secondary" : "on-color"} href={status.secondary.route}>
                    {status.secondary.label}
                  </Button>
                ) : null}
              </>
            }
          />
        )}

        {symptomDriven && latestBP ? <SymptomsClearedCard bp={latestBP} /> : null}

        {/* 2. Things she has been asked to do */}
        {!isLoadingFollowUpTasks && pendingTasks.length > 0 ? (
          <Card>
            <T variant="h2" style={{ marginBottom: 4 }}>
              To do
            </T>
            {pendingTasks.map((task: FollowUpTaskResponse, i) => (
              <Row
                key={task.id}
                last={i === pendingTasks.length - 1}
                icon={task.type === "RECHECK" ? "pulse-outline" : "medkit-outline"}
                title={task.type === "RECHECK" ? "Recheck your blood pressure" : "See a health worker"}
                subtitle={`Due ${new Date(task.dueAt).toLocaleString(undefined, {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}`}
                trailing={
                  <Button size="sm" href={task.type === "RECHECK" ? "/bp-entry" : "/clinic-finder"}>
                    {task.type === "RECHECK" ? "Log BP" : "Find clinic"}
                  </Button>
                }
              />
            ))}
          </Card>
        ) : null}

        {myHistory?.linked && !myHistory.submittedAt ? (
          <Card>
            <T variant="h2" style={{ marginBottom: 6 }}>
              {tr({ en: "Help your clinic know you", pcm: "Help your clinic know you well", yo: "Ran kílíníìkì rẹ lọ́wọ́ láti mọ̀ ọ́" })}
            </T>
            <T variant="body" style={{ marginBottom: 12 }}>
              {tr({
                en: "Answer a few questions about past pregnancies, your health and your family. About 3 minutes.",
                pcm: "Answer some questions about pregnancy wey you don get before, your health and your family. Like 3 minutes.",
                yo: "Dáhùn ìbéèrè díẹ̀ nípa àwọn oyún ti tẹ́lẹ̀, ìlera rẹ àti ẹbí rẹ. Nǹkan bí ìṣẹ́jú mẹ́ta.",
              })}
            </T>
            <Button href="/my-history">{tr({ en: "Answer now", pcm: "Answer now", yo: "Dáhùn báyìí" })}</Button>
          </Card>
        ) : null}

        {/* 3. Latest reading */}
        <Card>
          {isLoadingLatestBP ? (
            <Skeleton height={64} />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <T variant="label">Latest blood pressure</T>
                {latestBP ? (
                  <>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 8 }}>
                      <T variant="h1" style={{ fontSize: 40, lineHeight: 44, letterSpacing: -1 }}>
                        {latestBP.systolic}/{latestBP.diastolic}
                      </T>
                      <T variant="small" style={{ marginLeft: 6, marginBottom: 6, fontSize: 15 }}>
                        mmHg
                      </T>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                      {reading ? <Pill tone={reading.tone}>{reading.text}</Pill> : null}
                      <T variant="small">{timeAgo(latestBP.recordedAt)}</T>
                    </View>
                  </>
                ) : (
                  <T style={{ marginTop: 8 }}>No readings yet. Add your first one from your BP machine.</T>
                )}
              </View>
              <Button size="sm" href="/bp-entry" icon={(c) => <Ionicons name="pulse" size={18} color={c} />}>
                Log BP
              </Button>
            </View>
          )}
        </Card>

        {/* 4. Everything else she can do */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Tile href="/symptom-checker" icon="medkit-outline" label="How are you feeling?" hint="Report a symptom" />
            <Tile href="/appointments" icon="calendar-outline" label="Appointments" hint="Your antenatal visits" />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Tile href="/(tabs)/tracking" icon="pulse-outline" label="My readings" hint="Trends and history" />
            <Tile href="/(tabs)/education" icon="book-outline" label="Learn" hint="Week-by-week tips" />
          </View>
        </View>

        {/* 5. A tip based on what she reported */}
        <Card flat>
          <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: guidance.tone === "urgent" ? t.redBg : t.mint,
              }}
            >
              <Ionicons
                name={guidance.tone === "urgent" ? "warning-outline" : "heart-outline"}
                size={20}
                color={guidance.tone === "urgent" ? t.redInk : t.greenInk}
              />
            </View>
            <View style={{ flex: 1 }}>
              <T variant="title">{guidance.title}</T>
              <T variant="small" style={{ marginTop: 4 }}>
                {guidance.message}
              </T>
              <Pressable
                onPress={() => router.push(guidance.route as any)}
                accessibilityRole="button"
                style={{ minHeight: 44, justifyContent: "center" }}
              >
                <T variant="title" color={t.greenInk} style={{ fontSize: 15 }}>
                  {guidance.actionLabel}
                </T>
              </Pressable>
            </View>
          </View>
        </Card>

        {/* 6. Recent symptoms */}
        <SectionHeader
          title="Recent symptoms"
          actionLabel={(recentSymptoms?.length ?? 0) > 0 ? "See all" : undefined}
          onAction={() => router.push("/symptom-results")}
        />
        <Card flat>
          {isLoadingRecentSymptoms ? (
            <Skeleton height={56} />
          ) : (recentSymptoms?.length ?? 0) > 0 ? (
            recentSymptoms!.slice(0, 3).map((sym, i, arr) => (
              <Row
                key={sym.id}
                last={i === arr.length - 1}
                icon="medkit-outline"
                title={prettySymptom(sym.symptomType, sym.customSymptom)}
                subtitle={timeAgo(sym.recordedAt)}
              />
            ))
          ) : (
            <T variant="small">Nothing reported. Tell us whenever something feels different.</T>
          )}
        </Card>

        {/* 7. Always-visible way to get help */}
        <Pressable
          onPress={() => router.push("/emergency")}
          accessibilityRole="button"
          accessibilityLabel="Feeling very unwell? Alert your emergency contact and clinic"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            backgroundColor: t.surface,
            borderColor: t.red,
            borderWidth: 1.5,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.red, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="alert-circle-outline" size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <T variant="title">Feeling very unwell?</T>
            <T variant="small">Alert your emergency contact and clinic</T>
          </View>
          <Ionicons name="chevron-forward" size={22} color={t.red} />
        </Pressable>
      </Page>

      <FloatingEmergencyButton />
    </View>
  );
}
