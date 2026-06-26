import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { Button } from "../components/shared/Button";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useAppointments } from "../hooks/useAppointments";

type AppointmentType = "ANC" | "LAB" | "SCAN";

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { createAppointment, isCreatingAppointment } = useAppointments();
  const { showToast } = useToast();

  const [type, setType] = useState<AppointmentType>("ANC");
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      showToast({ type: "error", message: "Please enter appointment title" });
      return;
    }

    try {
      await createAppointment({
        type,
        title: title.trim(),
        dateTime,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      showToast({ type: "success", message: "Appointment scheduled!" });
      router.back();
    } catch (error) {
      console.error("Failed to create appointment:", error);
      showToast({ type: "error", message: "Failed to schedule appointment" });
    }
  };

  const typeOptions: { type: AppointmentType; label: string; icon: string }[] =
    [
      { type: "ANC", label: "ANC Visit", icon: "medical" },
      { type: "LAB", label: "Lab Test", icon: "flask-outline" },
      { type: "SCAN", label: "Scan", icon: "scan-outline" },
    ];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <View className="px-6 pt-4 mb-8 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#1A212E"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px] ml-4">
            New Appointment
          </Typography>
        </View>

        <View className="px-10">
          <Typography
            variant="caption"
            className={isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"}
          >
            Appointment Type
          </Typography>
          <View className="flex-row gap-3 mb-6">
            {typeOptions.map((option) => (
              <TouchableOpacity
                key={option.type}
                className={`flex-1 p-4 rounded-[20px] border ${
                  type === option.type
                    ? "border-primary bg-primary/10"
                    : isDark
                      ? "border-white/10 bg-[#020617]"
                      : "border-[#F1F5F9] bg-white"
                }`}
                onPress={() => setType(option.type)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={
                    type === option.type
                      ? Theme.colors.primary
                      : Theme.colors.textLight
                  }
                />
                <Typography
                  variant="body"
                  weight="bold"
                  className="mt-2"
                  style={{
                    color:
                      type === option.type
                        ? Theme.colors.primary
                        : Theme.colors.textLight,
                  }}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-6">
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"}
            >
              Title
            </Typography>
            <TextInput
              className={`px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
              placeholder="e.g. Routine ANC Checkup"
              placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-6">
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"}
            >
              Date & Time
            </Typography>
            <TextInput
              className={`px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="YYYY-MM-DDTHH:MM"
              placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
            />
          </View>

          <View className="mb-6">
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"}
            >
              Location (Optional)
            </Typography>
            <TextInput
              className={`px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
              placeholder="Clinic or hospital name"
              placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View className="mb-8">
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"}
            >
              Notes (Optional)
            </Typography>
            <TextInput
              className={`px-4 py-3 rounded-[16px] border min-h-[100px] ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
              placeholder="Any additional notes..."
              placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          <Button
            title={
              isCreatingAppointment ? "Scheduling..." : "Schedule Appointment"
            }
            className="h-[70px] rounded-[35px]"
            onPress={handleCreate}
            disabled={isCreatingAppointment}
          />
        </View>
      </Screen>
    </SafeAreaView>
  );
}
