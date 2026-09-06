import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, TouchableOpacity, View, Alert } from "react-native";

import { Card } from "../components/shared/Card";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { Skeleton } from "../components/ui/Skeleton";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Appointment, useAppointments } from "../hooks/useAppointments";

export default function AppointmentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { appointments, isLoadingAppointments, cancelAppointment } = useAppointments();
  ;

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "ANC":
        return "medical";
      case "LAB":
        return "flask-outline";
      case "SCAN":
        return "scan-outline";
      default:
        return "calendar";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return Theme.colors.primary;
      case "COMPLETED":
        return "#34E875";
      case "MISSED":
        return Theme.colors.emergency;
      default:
        return Theme.colors.textLight;
    }
  };

  
  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => cancelAppointment(id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <Card
      className={`mb-4 rounded-[24px] ${isDark ? "bg-[#020617] border-white/10" : "bg-white border-[#F1F5F9]"} p-5`}
    >
      <View className="flex-row items-start gap-4">
        <View
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-white/10" : "bg-[#F0F7FF]"}`}
        >
          <Ionicons
            name={getAppointmentIcon(item.type) as any}
            size={24}
            color={Theme.colors.primary}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Typography variant="h3" weight="bold" className="text-[16px]">
              {item.title}
            </Typography>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: getStatusColor(item.status) }}
              >
                {item.status}
              </Typography>
            </View>
            <View
              className="px-3 py-1 rounded-full ml-2"
              style={{ backgroundColor: item.appointmentSource === 'FACILITY' ? '#E0E7FF' : '#F3E8FF' }}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: item.appointmentSource === 'FACILITY' ? '#4338CA' : '#7E22CE' }}
              >
                {item.appointmentSource}
              </Typography>
            </View>

          </View>

          <View className="flex-row items-center gap-2 mt-2">
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Theme.colors.textLight}
            />
            <Typography
              variant="body"
              className="text-[14px]"
              style={{ color: Theme.colors.textLight }}
            >
              {formatDate(item.dateTime)}
            </Typography>
          </View>

          <View className="flex-row items-center gap-2 mt-1">
            <Ionicons
              name="time-outline"
              size={16}
              color={Theme.colors.textLight}
            />
            <Typography
              variant="body"
              className="text-[14px]"
              style={{ color: Theme.colors.textLight }}
            >
              {formatTime(item.dateTime)}
            </Typography>
          </View>

          {item.location && (
            <View className="flex-row items-center gap-2 mt-1">
              <Ionicons
                name="location-outline"
                size={16}
                color={Theme.colors.textLight}
              />
              <Typography
                variant="body"
                className="text-[14px]"
                style={{ color: Theme.colors.textLight }}
              >
                {item.location}
              </Typography>
            </View>
          )}
        
          {item.appointmentSource === 'PATIENT' && item.status === 'SCHEDULED' && (
            <TouchableOpacity onPress={() => handleCancel(item.id)} className="mt-4 p-2 bg-red-100 rounded-xl flex-row items-center justify-center gap-2 border border-red-200">
                <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                <Typography variant="body" weight="bold" style={{ color: '#EF4444' }}>Cancel Appointment</Typography>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </Card>
  );

  const renderSkeleton = () => (
    <View className="px-10">
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          height={120}
          borderRadius={24}
          style={{ marginBottom: 12 }}
          variant={isDark ? "dark" : "light"}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#1A212E"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">
            My Appointments
          </Typography>
          <TouchableOpacity onPress={() => router.push("/appointment-create")}>
            <Ionicons name="add" size={28} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoadingAppointments ? (
          renderSkeleton()
        ) : appointments?.length === 0 ? (
          <View className="px-10 flex items-center justify-center flex-1">
            <View
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/10" : "bg-[#F0F7FF]"}`}
            >
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Theme.colors.primary}
              />
            </View>
            <Typography variant="h3" weight="bold" className="text-[20px] mb-2">
              No appointments yet
            </Typography>
            <Typography
              variant="body"
              className={
                isDark
                  ? "text-gray-400 text-center"
                  : "text-gray-500 text-center"
              }
            >
              Schedule your first ANC, lab, or scan appointment!
            </Typography>
            
            <TouchableOpacity 
              onPress={() => router.push("/appointment-create")}
              className="mt-6 bg-primary px-6 py-3 rounded-full flex-row items-center gap-2 shadow-sm"
            >
              <Ionicons name="add" size={20} color="white" />
              <Typography variant="body" weight="bold" className="text-white">
                Add Appointment
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {/* Floating Action Button */}
        {appointments && appointments.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/appointment-create")}
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: Theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        )}
      </Screen>
    </SafeAreaView>
  );
}
