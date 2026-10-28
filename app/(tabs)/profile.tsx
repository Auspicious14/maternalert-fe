import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";

import apiClient from "../../api/client";
import { TokenStorage } from "../../api/storage";
import { AppHeader, Banner, Button, Card, FONT, Page, Pill, SectionHeader, Skeleton, T, useTokens } from "../../components/ds";
import { useToast } from "../../components/ui/ToastProvider";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useLang } from "../../hooks/useLang";
import { LANGUAGES } from "../../services/i18n";
import { chooseLang } from "../../services/langStorage";
import { notificationService } from "../../services/notifications";
import { CONDITION_OPTIONS, RELATIONSHIP_OPTIONS, Relationship, isValidName, isValidNigerianPhone } from "../../services/profileSetup";

// Same screen as maternalert-web/src/app/(patient)/profile/page.tsx

type Editing = null | "me" | "contact" | "pregnancy" | "clinic";

const relLabel = (r?: string | null) => RELATIONSHIP_OPTIONS.find((o) => o.value === r)?.label ?? "Emergency contact";
const conditionLabel = (c: string) => CONDITION_OPTIONS.find((o) => o.value === c)?.label ?? c.replace(/_/g, " ").toLowerCase();
const REMINDER_PRESETS = ["07:00", "09:00", "13:00", "18:00", "20:00"];

function Chip({ on, label, onPress, role = "button" }: { on: boolean; label: string; onPress: () => void; role?: "button" | "radio" }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={role === "radio" ? { checked: on } : { selected: on }}
      style={{
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1.5,
        justifyContent: "center",
        borderColor: on ? t.green : t.borderStrong,
        backgroundColor: on ? t.green : t.surface,
      }}
    >
      <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#fff" : t.ink2 }}>{label}</Text>
    </Pressable>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  const t = useTokens();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{label}</Text>
      {children}
      {hint ? <T variant="small">{hint}</T> : null}
    </View>
  );
}

function LinkRow({ icon, title, subtitle, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; onPress: () => void; last?: boolean }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        minHeight: 56,
        paddingVertical: 10,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: t.border,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={20} color={t.ink2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{title}</Text>
        {subtitle ? <T variant="small">{subtitle}</T> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.muted} />
    </Pressable>
  );
}

function EditButton({ label, onPress }: { label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: t.border, alignItems: "center", justifyContent: "center", backgroundColor: t.surface }}
    >
      <Ionicons name="pencil" size={18} color={t.ink} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const t = useTokens();
  const { profile, isLoadingProfile, isErrorProfile, updateProfile, pregnancyTimeline } = useUserProfile() as any;
  const { preference, setPreference } = useAppTheme();
  const { logout } = useAuth() as any;
  const { showToast } = useToast();
  const lang = useLang();

  const [editing, setEditing] = useState<Editing>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [facility, setFacility] = useState<{ linked: boolean; facilityName?: string } | null>(null);

  const [myName, setMyName] = useState("");
  const [myPhone, setMyPhone] = useState("");
  const [rel, setRel] = useState<Relationship | null>(null);
  const [phone, setPhone] = useState("");
  const [weeks, setWeeks] = useState("");
  const [first, setFirst] = useState(false);
  const [conds, setConds] = useState<string[]>([]);
  const [clinicName, setClinicName] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [reminder, setReminder] = useState("09:00");

  useEffect(() => {
    if (!isLoadingProfile && !isErrorProfile && profile === null) router.replace("/profile-setup");
  }, [profile, isLoadingProfile, isErrorProfile, router]);

  useEffect(() => {
    apiClient
      .get("/facilities/link-status")
      .then((r) => setFacility(r.data))
      .catch(() => setFacility(null));
  }, []);

  useEffect(() => {
    if (profile?.reminderTime) setReminder(profile.reminderTime);
  }, [profile?.reminderTime]);

  const inputStyle = {
    fontFamily: FONT.regular,
    fontSize: 16,
    color: t.ink,
    backgroundColor: t.surface,
    borderWidth: 1.5,
    borderColor: t.borderStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  };

  const open = (what: Editing) => {
    setFormError(null);
    if (what === "me") {
      setMyName(profile?.fullName ?? "");
      setMyPhone(profile?.phone ?? "");
    }
    if (what === "contact") {
      setRel(profile?.emergencyContactRelationship ?? null);
      setPhone(profile?.emergencyContactPhone ?? "");
    }
    if (what === "pregnancy") {
      setWeeks(String(pregnancyTimeline?.currentWeek ?? profile?.pregnancyWeeks ?? ""));
      setFirst(Boolean(profile?.firstPregnancy));
      setConds((profile?.knownConditions ?? []).filter((c: string) => c !== "NONE"));
    }
    if (what === "clinic") {
      setClinicName(profile?.clinicName ?? "");
      setClinicPhone(profile?.clinicPhone ?? "");
      setClinicAddress(profile?.clinicAddress ?? "");
    }
    setEditing(what);
  };

  const save = async (data: Record<string, unknown>, done: string) => {
    setSaving(true);
    setFormError(null);
    try {
      await updateProfile(data);
      setEditing(null);
      showToast({ type: "success", message: done });
    } catch {
      setFormError("We couldn't save that. Check your internet and try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveMe = () => {
    if (!isValidName(myName)) return setFormError("Please enter your name.");
    if (myPhone.trim() && !isValidNigerianPhone(myPhone)) return setFormError("Please enter your full phone number, for example 0803 123 4567.");
    save({ fullName: myName.trim(), phone: myPhone.trim() }, "Your details are saved.");
  };

  const saveContact = () => {
    if (!rel) return setFormError("Please choose who this person is.");
    if (!isValidNigerianPhone(phone)) return setFormError("Please enter a full phone number, for example 0803 123 4567.");
    save({ emergencyContactRelationship: rel, emergencyContactPhone: phone.trim() }, "Emergency contact saved.");
  };

  const savePregnancy = () => {
    const w = Number(weeks);
    if (weeks === "" || Number.isNaN(w) || w < 0 || w > 42) return setFormError("Please enter weeks between 0 and 42.");
    save({ pregnancyWeeks: Math.round(w), firstPregnancy: first, knownConditions: conds.length ? conds : ["NONE"] }, "Pregnancy details saved.");
  };

  const saveClinic = () => {
    if (clinicPhone.trim() && !isValidNigerianPhone(clinicPhone)) return setFormError("Please enter the clinic's full phone number.");
    save({ clinicName: clinicName.trim(), clinicPhone: clinicPhone.trim(), clinicAddress: clinicAddress.trim() }, "Clinic details saved.");
  };

  const saveReminder = async (on: boolean, time = reminder) => {
    let tm = time.trim();
    if (/^\d:[0-5]\d$/.test(tm)) tm = `0${tm}`;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(tm)) {
      showToast({ type: "info", message: "Please use 24-hour time, for example 20:30." });
      return;
    }
    setSaving(true);
    try {
      if (on) {
        const [h, m] = tm.split(":").map(Number);
        await TokenStorage.saveReminderTime(tm);
        await notificationService.scheduleDailyBPReminder(h, m);
      }
      await updateProfile({ reminderTime: tm, notifyReminders: on });
      setReminder(tm);
      showToast({ type: "success", message: on ? `Daily reminder set for ${tm}.` : "Daily reminder turned off." });
    } catch {
      showToast({ type: "error", message: "We couldn't save your reminder. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const Actions = ({ onSave }: { onSave: () => void }) => (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Button block onPress={onSave} loading={saving} disabled={saving}>
          Save
        </Button>
      </View>
      <View style={{ flex: 1 }}>
        <Button block variant="secondary" onPress={() => setEditing(null)}>
          Cancel
        </Button>
      </View>
    </View>
  );

  if (isLoadingProfile || !profile) {
    return (
      <Page>
        <AppHeader title="Profile" />
        <Skeleton height={140} />
        <Skeleton height={120} />
        <Skeleton height={200} />
      </Page>
    );
  }

  const tl = pregnancyTimeline?.isValid ? pregnancyTimeline : null;
  const conditions: string[] = (profile.knownConditions ?? []).filter((c: string) => c !== "NONE");
  const remindersOn = profile.notifyReminders !== false;

  return (
    <Page>
      <AppHeader title="Profile" subtitle="Your details and settings" />

      {/* You */}
      <Card>
        {editing === "me" ? (
          <View style={{ gap: 16 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 18, color: t.ink }}>About you</Text>
            <Field label="Your name">
              <TextInput
                accessibilityLabel="Your name"
                textContentType="name"
                autoComplete="name"
                autoCapitalize="words"
                placeholder="For example, Amina Bello"
                placeholderTextColor={t.muted}
                maxLength={80}
                value={myName}
                onChangeText={setMyName}
                style={inputStyle}
              />
            </Field>
            <Field label="Your phone number" hint="Your clinic and emergency contact see this if you need help, so they can call you.">
              <TextInput
                accessibilityLabel="Your phone number"
                keyboardType="phone-pad"
                autoComplete="tel"
                placeholder="0803 123 4567"
                placeholderTextColor={t.muted}
                value={myPhone}
                onChangeText={setMyPhone}
                style={inputStyle}
              />
            </Field>
            {formError ? <Banner tone="red">{formError}</Banner> : null}
            <Actions onSave={saveMe} />
          </View>
        ) : profile.fullName ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.mint, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="person-outline" size={20} color={t.greenInk} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{profile.fullName}</Text>
              <T variant="small">{profile.phone || "No phone number added"}</T>
            </View>
            <EditButton label="Edit your name and phone" onPress={() => open("me")} />
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            <Banner tone="amber">Add your name so alerts tell your clinic and family who needs help.</Banner>
            <Button onPress={() => open("me")}>Add your name and phone</Button>
          </View>
        )}
      </Card>

      {/* Pregnancy */}
      <Card>
        {editing === "pregnancy" ? (
          <View style={{ gap: 16 }}>
            <T variant="h2">Pregnancy details</T>
            <Field label="Weeks pregnant today">
              <TextInput
                accessibilityLabel="Weeks pregnant today"
                keyboardType="number-pad"
                maxLength={2}
                value={weeks}
                onChangeText={(v) => setWeeks(v.replace(/[^0-9]/g, ""))}
                style={[inputStyle, { width: 120 }]}
              />
            </Field>
            <Field label="First pregnancy?">
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Chip role="radio" on={first} label="Yes" onPress={() => setFirst(true)} />
                <Chip role="radio" on={!first} label="No" onPress={() => setFirst(false)} />
              </View>
            </Field>
            <Field label="Health conditions">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {CONDITION_OPTIONS.map((c) => (
                  <Chip
                    key={c.value}
                    on={conds.includes(c.value)}
                    label={c.label}
                    onPress={() => setConds((x) => (x.includes(c.value) ? x.filter((y) => y !== c.value) : [...x, c.value]))}
                  />
                ))}
              </View>
            </Field>
            {formError ? <Banner tone="red">{formError}</Banner> : null}
            <Actions onSave={savePregnancy} />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <View style={{ flex: 1, gap: 4 }}>
                <T variant="label">Your pregnancy</T>
                <Text style={{ fontFamily: FONT.bold, fontSize: 19, color: t.ink }}>
                  {`${tl ? tl.currentWeek : profile.pregnancyWeeks} weeks`}
                  {tl ? <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>{` · ${tl.trimesterLabel}`}</Text> : null}
                </Text>
                {tl ? (
                  <T variant="small">
                    {`Due around ${new Date(tl.estimatedDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
                  </T>
                ) : null}
              </View>
              <EditButton label="Edit pregnancy details" onPress={() => open("pregnancy")} />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              <Pill>{profile.firstPregnancy ? "First pregnancy" : "Been pregnant before"}</Pill>
              {conditions.map((c) => (
                <Pill key={c} tone="amber">
                  {conditionLabel(c)}
                </Pill>
              ))}
            </View>
          </>
        )}
      </Card>

      {/* Emergency contact */}
      <SectionHeader title="Emergency contact" />
      <Card>
        {editing === "contact" ? (
          <View style={{ gap: 16 }}>
            <Field label="Who is this person?">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {RELATIONSHIP_OPTIONS.map((r) => (
                  <Chip key={r.value} role="radio" on={rel === r.value} label={r.label} onPress={() => setRel(r.value)} />
                ))}
              </View>
            </Field>
            <Field label="Phone number" hint="Use a number with WhatsApp if possible. We also send an SMS.">
              <TextInput
                accessibilityLabel="Emergency contact phone number"
                keyboardType="phone-pad"
                autoComplete="tel"
                placeholder="0803 123 4567"
                placeholderTextColor={t.muted}
                value={phone}
                onChangeText={setPhone}
                style={inputStyle}
              />
            </Field>
            {formError ? <Banner tone="red">{formError}</Banner> : null}
            <Actions onSave={saveContact} />
          </View>
        ) : profile.emergencyContactPhone ? (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="person-outline" size={20} color={t.ink2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{relLabel(profile.emergencyContactRelationship)}</Text>
                <T variant="small">{profile.emergencyContactPhone}</T>
              </View>
              <EditButton label="Edit emergency contact" onPress={() => open("contact")} />
            </View>
            <T variant="small" style={{ marginTop: 10 }}>
              Gets a WhatsApp message and an SMS when you press the emergency button.
            </T>
          </>
        ) : (
          <View style={{ gap: 12 }}>
            <Banner tone="amber">No emergency contact yet. The emergency button can only alert your clinic.</Banner>
            <Button onPress={() => open("contact")}>Add emergency contact</Button>
          </View>
        )}
      </Card>

      {/* Clinic */}
      <SectionHeader title="Your clinic" />
      <Card>
        <LinkRow
          icon="business-outline"
          title={facility?.linked ? facility.facilityName ?? "Your clinic" : "Not linked to a clinic"}
          subtitle={facility?.linked ? "Sees your readings and gets your alerts" : "Link so your midwife can see your readings"}
          onPress={() => router.push("/facility-linking")}
          last
        />
        {editing === "clinic" ? (
          <View style={{ gap: 16, marginTop: 12 }}>
            <T variant="small">If your clinic isn't on MaternAlert yet, save its details here so you have them in an emergency.</T>
            <Field label="Clinic name">
              <TextInput accessibilityLabel="Clinic name" value={clinicName} onChangeText={setClinicName} maxLength={120} style={inputStyle} />
            </Field>
            <Field label="Clinic phone">
              <TextInput accessibilityLabel="Clinic phone" keyboardType="phone-pad" value={clinicPhone} onChangeText={setClinicPhone} style={inputStyle} />
            </Field>
            <Field label="Address">
              <TextInput accessibilityLabel="Clinic address" value={clinicAddress} onChangeText={setClinicAddress} maxLength={200} style={inputStyle} />
            </Field>
            {formError ? <Banner tone="red">{formError}</Banner> : null}
            <Actions onSave={saveClinic} />
          </View>
        ) : profile.clinicName || profile.clinicPhone ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{profile.clinicName || "My clinic"}</Text>
              <T variant="small">{[profile.clinicPhone, profile.clinicAddress].filter(Boolean).join(" · ")}</T>
            </View>
            {profile.clinicPhone ? (
              <Button size="sm" variant="secondary" href={`tel:${profile.clinicPhone}`} icon={(c) => <Ionicons name="call-outline" size={16} color={c} />}>
                Call
              </Button>
            ) : null}
            <EditButton label="Edit clinic details" onPress={() => open("clinic")} />
          </View>
        ) : !facility?.linked ? (
          <Pressable onPress={() => open("clinic")} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center", marginTop: 4 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Or save your clinic's phone number</Text>
          </Pressable>
        ) : null}
      </Card>

      {/* Reminders */}
      <SectionHeader title="Reminders" />
      <Card>
        <Field label="Daily blood pressure reminder" hint={remindersOn ? `On · every day at ${profile.reminderTime ?? reminder}` : "Off"}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {REMINDER_PRESETS.map((p) => (
              <Chip key={p} role="radio" on={remindersOn && reminder === p} label={p} onPress={() => saveReminder(true, p)} />
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              accessibilityLabel="Reminder time, 24-hour, for example 20:30"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              value={reminder}
              onChangeText={setReminder}
              style={[inputStyle, { flex: 1 }]}
            />
            <Button onPress={() => saveReminder(true)} loading={saving}>
              {remindersOn ? "Update" : "Turn on"}
            </Button>
          </View>
        </Field>
        {remindersOn ? (
          <Pressable onPress={() => saveReminder(false)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center", marginTop: 4 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Turn off daily reminder</Text>
          </Pressable>
        ) : null}
      </Card>

      {/* Appearance */}
      <SectionHeader title="Appearance" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }} accessibilityRole="radiogroup">
        {(
          [
            ["light", "Light"],
            ["dark", "Dark"],
            ["system", "Same as phone"],
          ] as const
        ).map(([v, l]) => (
          <Chip key={v} role="radio" on={preference === v} label={l} onPress={() => setPreference(v)} />
        ))}
      </View>

      <SectionHeader title="Language" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }} accessibilityRole="radiogroup">
        {LANGUAGES.map((l) => (
          <Chip key={l.code} role="radio" on={lang === l.code} label={l.native} onPress={() => chooseLang(l.code)} />
        ))}
      </View>
      <T variant="small" style={{ marginTop: -4 }}>
        {lang === "pcm"
          ? "Pidgin dey for the main screens: danger signs, your BP result and emergency. Other screens still dey for English."
          : "Pidgin covers the main screens: danger signs, BP results and emergency. Other screens stay in English for now."}
      </T>

      {/* More */}
      <SectionHeader title="More" />
      <Card>
        <LinkRow icon="document-text-outline" title="Health records" subtitle="Scans, visits and notes from your clinic" onPress={() => router.push("/my-health-records")} />
        <LinkRow icon="calendar-outline" title="Appointments" onPress={() => router.push("/appointments")} />
        <LinkRow icon="notifications-outline" title="Notifications" onPress={() => router.push("/notifications")} />
        <LinkRow icon="happy-outline" title="Your baby week by week" onPress={() => router.push("/fetal-development")} />
        <LinkRow icon="book-outline" title="Learn" onPress={() => router.push("/(tabs)/education")} />
        <LinkRow icon="help-buoy-outline" title="Get help" subtitle="support@maternalert.com.ng" onPress={() => Linking.openURL("mailto:support@maternalert.com.ng")} />
        <LinkRow icon="shield-checkmark-outline" title="Privacy policy" onPress={() => Linking.openURL("https://maternalert.com.ng/privacy")} last />
      </Card>

      {confirmLogout ? (
        <Card flat>
          <T>Sign out? You won't get reminders on this phone until you sign in again.</T>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <View style={{ flex: 1 }}>
              <Button block variant="danger" onPress={() => logout()}>
                Sign out
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button block variant="secondary" onPress={() => setConfirmLogout(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </Card>
      ) : (
        <Button block variant="secondary" onPress={() => setConfirmLogout(true)} icon={(c) => <Ionicons name="log-out-outline" size={18} color={c} />}>
          Sign out
        </Button>
      )}
    </Page>
  );
}
