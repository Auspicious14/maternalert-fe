import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, Skeleton, T, timeAgo, useTokens } from "../components/ds";
import { Notification, useNotifications } from "../hooks/useNotifications";
import { notificationMeta } from "../services/appointmentCopy";

// Same screen as maternalert-web/src/app/(patient)/notifications/page.tsx

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  CARE_PRIORITY: "warning-outline",
  BP_ALERT: "pulse-outline",
  SYMPTOM_ALERT: "medkit-outline",
  REMINDER: "alarm-outline",
  ANC_REMINDER: "calendar-outline",
  EDUCATIONAL: "book-outline",
};

// Web routes -> app routes
const APP_ROUTE: Record<string, string> = {
  "/home": "/(tabs)",
  "/tracking": "/(tabs)/tracking",
  "/education": "/(tabs)/education",
};

function dayGroup(iso: string): string {
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(new Date()) - start(new Date(iso))) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "This week";
  return "Earlier";
}

export default function NotificationsScreen() {
  const router = useRouter();
  const t = useTokens();
  const { notifications, isLoading, error, refetch, markAsRead, unreadCount } = useNotifications();
  const [marking, setMarking] = useState(false);

  const groups = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const out: { label: string; items: Notification[] }[] = [];
    for (const n of sorted) {
      const g = dayGroup(n.createdAt);
      if (!out.length || out[out.length - 1].label !== g) out.push({ label: g, items: [] });
      out[out.length - 1].items.push(n);
    }
    return out;
  }, [notifications]);

  const open = (n: Notification) => {
    if (!n.read) markAsRead(n.id).catch(() => undefined);
    const route = notificationMeta(n.type).route;
    router.push((APP_ROUTE[route] ?? route) as any);
  };

  const markAll = async () => {
    setMarking(true);
    try {
      await Promise.all(notifications.filter((n) => !n.read).map((n) => markAsRead(n.id)));
    } catch {
      // list refreshes on its own
    } finally {
      setMarking(false);
    }
  };

  const toneColors = (tone: string) =>
    tone === "red" ? [t.redBg, t.redInk] : tone === "amber" ? [t.amberBg, t.amberInk] : tone === "green" ? [t.mint, t.greenInk] : [t.surface2, t.ink2];

  return (
    <Page>
      <AppHeader
        title="Notifications"
        subtitle={unreadCount ? `${unreadCount} unread` : undefined}
        onBack={() => router.back()}
        actions={
          unreadCount ? (
            <Button size="sm" variant="secondary" onPress={markAll} loading={marking}>
              Mark all read
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
        </View>
      ) : error ? (
        <View style={{ gap: 10 }}>
          <Banner tone="amber">We couldn't load notifications.</Banner>
          <Button variant="secondary" onPress={() => refetch()}>
            Try again
          </Button>
        </View>
      ) : notifications.length === 0 ? (
        <Card>
          <T variant="h2">No notifications yet</T>
          <T style={{ marginTop: 8 }}>Reminders, blood pressure alerts and messages from your clinic will show here.</T>
        </Card>
      ) : (
        groups.map((g) => (
          <View key={g.label} style={{ gap: 8 }}>
            <T variant="label">{g.label}</T>
            <Card>
              {g.items.map((n, i) => {
                const meta = notificationMeta(n.type);
                const [bg, fg] = toneColors(meta.tone);
                return (
                  <Pressable
                    key={n.id}
                    onPress={() => open(n)}
                    accessibilityRole="button"
                    accessibilityLabel={`${n.read ? "" : "Unread. "}${n.title}. ${n.message}`}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      gap: 14,
                      paddingVertical: 14,
                      paddingTop: i === 0 ? 0 : 14,
                      paddingBottom: i === g.items.length - 1 ? 0 : 14,
                      borderBottomWidth: i === g.items.length - 1 ? 0 : 1,
                      borderBottomColor: t.border,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={ICONS[n.type] ?? "notifications-outline"} size={20} color={fg} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        {!n.read ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.green }} /> : null}
                        <Text style={{ flex: 1, fontFamily: n.read ? FONT.medium : FONT.bold, fontSize: 16, color: t.ink }}>{n.title}</Text>
                      </View>
                      <T variant="small">{n.message}</T>
                      <T variant="small" style={{ marginTop: 2 }}>{`${meta.label} · ${timeAgo(n.createdAt)}`}</T>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={t.muted} />
                  </Pressable>
                );
              })}
            </Card>
          </View>
        ))
      )}
    </Page>
  );
}
