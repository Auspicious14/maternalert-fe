import { Switch, ActivityIndicator, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { Badge } from "../../components/shared/Badge";
import { Button } from "../../components/shared/Button";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import { Loading } from "../../components/ui/Loading";
import Theme from "../../constants/theme";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, isLoadingProfile, updateProfile, isUpdatingProfile } =
    useUserProfile();

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactRelationship, setContactRelationship] = useState(
    profile?.emergencyContactRelationship ?? null
  );
  const [contactPhone, setContactPhone] = useState(
    profile?.emergencyContactPhone ?? ""
  );

  // Clinic Edit State
  const [isEditingClinic, setIsEditingClinic] = useState(false);
  const [clinicName, setClinicName] = useState(profile?.clinicName ?? "");
  const [clinicAddress, setClinicAddress] = useState(profile?.clinicAddress ?? "");
  const [clinicPhone, setClinicPhone] = useState(profile?.clinicPhone ?? "");

  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop';

  const relationshipLabel =
    profile?.emergencyContactRelationship === "MIDWIFE"
      ? "Midwife"
      : profile?.emergencyContactRelationship === "PARTNER"
      ? "Husband/Partner"
      : profile?.emergencyContactRelationship === "FAMILY_MEMBER"
      ? "Family member"
      : profile?.emergencyContactRelationship === "OTHER"
      ? "Emergency contact"
      : "Emergency contact";

  const handleSaveEmergencyContact = async () => {
    if (!contactRelationship || !contactPhone.trim()) return;
    await updateProfile({
      emergencyContactRelationship: contactRelationship,
      emergencyContactPhone: contactPhone.trim(),
    });
    setIsEditingContact(false);
  };

  const handleSaveClinic = async () => {
    await updateProfile({
      clinicName,
      clinicAddress,
      clinicPhone,
    });
    setIsEditingClinic(false);
  };

  const handleCallContact = () => {
    if (!profile?.emergencyContactPhone) return;
    Linking.openURL(`tel:${profile.emergencyContactPhone}`);
  };

  const handleCallClinic = () => {
    if (!profile?.clinicPhone) return;
    Linking.openURL(`tel:${profile.clinicPhone}`);
  };

  if (isLoadingProfile) {
    return (
      <Screen style={styles.container} scrollable={false}>
         {/* Header Skeleton */}
         <View style={[styles.header, { marginBottom: 32 }]}>
            <Skeleton width={32} height={32} borderRadius={16} variant="light" />
            <Skeleton width={120} height={32} variant="light" />
            <Skeleton width={40} height={20} variant="light" />
         </View>

         {/* Avatar Skeleton */}
         <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Skeleton width={110} height={110} borderRadius={55} variant="light" />
         </View>

         {/* Badges Skeleton */}
         <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
            <Skeleton width={100} height={40} borderRadius={20} variant="light" />
            <Skeleton width={140} height={40} borderRadius={20} variant="light" />
         </View>

         {/* Status Card Skeleton */}
         <Skeleton height={120} borderRadius={16} variant="light" style={{ marginBottom: 32 }} />

         {/* Sections Skeleton */}
         <Skeleton width={200} height={24} variant="light" style={{ marginBottom: 16 }} />
         <Skeleton height={80} borderRadius={16} variant="light" style={{ marginBottom: 32 }} />

         <Skeleton width={200} height={24} variant="light" style={{ marginBottom: 16 }} />
         <Skeleton height={80} borderRadius={16} variant="light" />
      
      {/* Notification Settings */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">Notification Settings</Typography>
      </View>
      <Card style={styles.clinicCard}>
        <View style={styles.settingRow}>
           <Typography variant="body">Care Priorities</Typography>
           <Switch
             value={profile?.notifyCarePriority ?? true}
             onValueChange={(val) => updateProfile({ notifyCarePriority: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Blood Pressure Alerts</Typography>
           <Switch
             value={profile?.notifyBpAlert ?? true}
             onValueChange={(val) => updateProfile({ notifyBpAlert: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Symptom Alerts</Typography>
           <Switch
             value={profile?.notifySymptomAlert ?? true}
             onValueChange={(val) => updateProfile({ notifySymptomAlert: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Daily Reminders</Typography>
           <Switch
             value={profile?.notifyReminders ?? true}
             onValueChange={(val) => updateProfile({ notifyReminders: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
      </Card>

    </Screen>
    );
  }
  return (
    <Screen style={styles.container} scrollable>
      {/* Loading overlay removed for better UX */}
      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Typography variant="h2">My Profile</Typography>
        <TouchableOpacity>
          <Typography variant="body" style={styles.editText}>
            Edit
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOutline}>
            <View style={styles.avatarPlaceholder}>
              <Image 
                source={{ uri: DEFAULT_AVATAR }} 
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="pencil" size={16} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.badgeRow}>
          <Badge
            label={profile ? `${profile.pregnancyWeeks} Weeks` : "Weeks"}
            variant="white"
            icon={
              <Ionicons name="calendar-outline" size={16} color="#34E875" />
            }
            containerStyle={styles.profileBadge}
          />
          <Badge
            label={
              profile?.firstPregnancy ? "1st Pregnancy" : "Previous pregnancy"
            }
            variant="white"
            icon={<Ionicons name="medical-outline" size={16} color="#34E875" />}
            containerStyle={styles.profileBadge}
          />
        </View>
      </View>

      {/* Routine Care Status Card */}
      <Card variant="routine" style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusCheckContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#34E875" />
          </View>
          <View style={styles.statusTextContainer}>
            <Typography variant="h3" style={styles.statusTitle}>
              Routine care recommended
            </Typography>
            <Typography variant="caption" color={Theme.colors.textLight}>
              Your blood pressure is within normal range. Keep tracking daily.
            </Typography>
          </View>
        </View>
        <Button
          title="View History"
          variant="secondary"
          containerStyle={styles.historyButton}
          textStyle={{ color: Theme.colors.text }}
          onPress={() => router.push('/symptom-results')}
        />
      </Card>

      {/* Emergency Contacts */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">My Emergency Contact</Typography>
        <TouchableOpacity
          onPress={() => {
            setContactRelationship(
              profile?.emergencyContactRelationship ?? null
            );
            setContactPhone(profile?.emergencyContactPhone ?? "");
            setIsEditingContact(true);
          }}
        >
          <Typography variant="body" style={styles.actionLinkText}>
            {profile?.emergencyContactPhone ? "Edit" : "Add New"}
          </Typography>
        </TouchableOpacity>
      </View>

      {isEditingContact ? (
        <Card style={styles.contactCard}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12, gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.relationshipChip,
                  contactRelationship === "MIDWIFE" && styles.relationshipChipActive,
                ]}
                onPress={() => setContactRelationship("MIDWIFE")}
              >
                <Typography variant="caption">Midwife</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.relationshipChip,
                  contactRelationship === "PARTNER" && styles.relationshipChipActive,
                ]}
                onPress={() => setContactRelationship("PARTNER")}
              >
                <Typography variant="caption">Husband/Partner</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.relationshipChip,
                  contactRelationship === "FAMILY_MEMBER" &&
                    styles.relationshipChipActive,
                ]}
                onPress={() => setContactRelationship("FAMILY_MEMBER")}
              >
                <Typography variant="caption">Family member</Typography>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.contactInput}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={contactPhone}
              onChangeText={setContactPhone}
            />
          </View>

          <Button
            title={isUpdatingProfile ? "Saving..." : "Save"}
            variant="secondary"
            containerStyle={styles.saveContactButton}
            onPress={handleSaveEmergencyContact}
            disabled={isUpdatingProfile}
          />
        </Card>
      ) : profile?.emergencyContactPhone ? (
        <Card style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <View style={[styles.contactIcon, { backgroundColor: "#EBF3FE" }]}>
              <Ionicons name="person" size={20} color="#1565C0" />
            </View>
            <View style={styles.contactContent}>
              <Typography variant="h3">
                {relationshipLabel}
              </Typography>
              <Typography variant="caption" color={Theme.colors.textLight}>
                {profile.emergencyContactPhone}
              </Typography>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCallContact}>
            <Ionicons name="call" size={20} color="#34E875" />
          </TouchableOpacity>
        </Card>
      ) : (
        <Card style={styles.contactCard}>
          <Typography variant="body" color={Theme.colors.textLight}>
            No emergency contact added yet.
          </Typography>
        </Card>
      )}

      {/* Clinic Info */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">My Clinic Info</Typography>
        <TouchableOpacity
          onPress={() => {
            setClinicName(profile?.clinicName ?? "");
            setClinicAddress(profile?.clinicAddress ?? "");
            setClinicPhone(profile?.clinicPhone ?? "");
            setIsEditingClinic(true);
          }}
        >
          <Typography variant="body" style={styles.actionLinkText}>
            {profile?.clinicName ? "Edit" : "Add Info"}
          </Typography>
        </TouchableOpacity>
      </View>

      {isEditingClinic ? (
        <Card style={styles.clinicCard}>
          <View>
             <TextInput
              style={styles.contactInput}
              placeholder="Clinic Name"
              value={clinicName}
              onChangeText={setClinicName}
            />
            <TextInput
              style={styles.contactInput}
              placeholder="Address"
              value={clinicAddress}
              onChangeText={setClinicAddress}
            />
            <TextInput
              style={styles.contactInput}
              placeholder="Phone (optional)"
              keyboardType="phone-pad"
              value={clinicPhone}
              onChangeText={setClinicPhone}
            />
            <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
               <Button
                title={isUpdatingProfile ? "Saving..." : "Save"}
                variant="secondary"
                containerStyle={styles.saveContactButton}
                onPress={handleSaveClinic}
                disabled={isUpdatingProfile}
              />
            </View>
          </View>
        </Card>
      ) : profile?.clinicName ? (
        <Card style={styles.clinicCard}>
          <View style={styles.clinicHeader}>
            <View style={[styles.clinicIcon, { backgroundColor: "#FFEBEE" }]}>
              <Ionicons name="medical" size={20} color="#C62828" />
            </View>
            <View style={styles.clinicContent}>
              <Typography variant="h3">{profile.clinicName}</Typography>
              <Typography variant="caption" color={Theme.colors.textLight}>
                {profile.clinicAddress || 'No address provided'}
              </Typography>
              {profile.clinicPhone && (
                <Typography variant="caption" color={Theme.colors.textLight}>
                  Phone: {profile.clinicPhone}
                </Typography>
              )}
            </View>
          </View>

          <View style={styles.clinicActions}>
            <Button
              title="Call Clinic"
              variant="outline"
              containerStyle={styles.clinicActionButton}
              icon={<Ionicons name="call-outline" size={18} />}
              onPress={handleCallClinic}
              disabled={!profile.clinicPhone}
            />
            <Button
              title="Directions"
              variant="outline"
              containerStyle={styles.clinicActionButton}
              icon={<Ionicons name="navigate-outline" size={18} />}
              onPress={() => router.push('/clinic-finder')}
            />
          </View>
        </Card>
      ) : (
         <Card style={styles.clinicCard}>
          <Typography variant="body" color={Theme.colors.textLight}>
            No clinic information added yet.
          </Typography>
        </Card>
      )}
    
      {/* Notification Settings */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">Notification Settings</Typography>
      </View>
      <Card style={styles.clinicCard}>
        <View style={styles.settingRow}>
           <Typography variant="body">Care Priorities</Typography>
           <Switch
             value={profile?.notifyCarePriority ?? true}
             onValueChange={(val) => updateProfile({ notifyCarePriority: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Blood Pressure Alerts</Typography>
           <Switch
             value={profile?.notifyBpAlert ?? true}
             onValueChange={(val) => updateProfile({ notifyBpAlert: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Symptom Alerts</Typography>
           <Switch
             value={profile?.notifySymptomAlert ?? true}
             onValueChange={(val) => updateProfile({ notifySymptomAlert: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
        <View style={styles.settingRow}>
           <Typography variant="body">Daily Reminders</Typography>
           <Switch
             value={profile?.notifyReminders ?? true}
             onValueChange={(val) => updateProfile({ notifyReminders: val })}
             trackColor={{ false: "#767577", true: "#34E875" }}
           />
        </View>
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.s,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.l,
  },
  iconButton: {
    padding: 4,
  },
  editText: {
    color: "#34E875",
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: Theme.spacing.l,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Theme.spacing.m,
  },
  avatarOutline: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: Theme.colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#34E875",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Theme.colors.white,
  },
  userName: {
    marginBottom: Theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: Theme.spacing.m,
    gap: Theme.spacing.s,
  },
  profileBadge: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statusCard: {
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.m,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.m,
  },
  statusCheckContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.m,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    marginBottom: 2,
  },
  historyButton: {
    backgroundColor: "#34E875",
    height: 50,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.m,
  },
  actionLinkText: {
    color: "#34E875",
    fontWeight: "600",
  },
  contactCard: {
    marginBottom: Theme.spacing.m,
    padding: Theme.spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.m,
  },
  contactContent: {
    flex: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  relationshipChip: {
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  relationshipChipActive: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#34E875",
  },
  contactInput: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveContactButton: {
    flex: 1,
    height: 40,
    marginLeft: 12,
  },
  clinicCard: {
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.xl,
  },
  clinicHeader: {
    flexDirection: "row",
    marginBottom: Theme.spacing.m,
  },
  clinicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.m,
  },
  clinicContent: {
    flex: 1,
  },
  clinicActions: {
    flexDirection: "row",
    gap: Theme.spacing.m,
  },
  
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

    clinicActionButton: {
    flex: 1,
    height: 44,
  },
});
