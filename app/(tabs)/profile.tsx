import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <Screen style={styles.container} scrollable>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Typography variant="h2">My Profile</Typography>
        <TouchableOpacity>
          <Typography variant="body" style={styles.editText}>Edit</Typography>
        </TouchableOpacity>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOutline}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color="#CBD5E0" />
            </View>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="pencil" size={16} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>
        
        <Typography variant="h1" style={styles.userName}>Sarah M.</Typography>
        <Typography variant="caption" color={Theme.colors.textLight}>ID: #839201</Typography>

        <View style={styles.badgeRow}>
          <Badge 
            label="24 Weeks" 
            variant="white" 
            icon={<Ionicons name="calendar-outline" size={16} color="#34E875" />} 
            containerStyle={styles.profileBadge}
          />
          <Badge 
            label="1st Pregnancy" 
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
            <Typography variant="h3" style={styles.statusTitle}>Routine care recommended</Typography>
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
        />
      </Card>

      {/* Emergency Contacts */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">My Emergency Contacts</Typography>
        <TouchableOpacity>
          <Typography variant="body" style={styles.actionLinkText}>Add New</Typography>
        </TouchableOpacity>
      </View>

      <Card style={styles.contactCard}>
        <View style={styles.contactInfo}>
          <View style={[styles.contactIcon, { backgroundColor: '#EBF3FE' }]}>
            <Ionicons name="person" size={20} color="#1565C0" />
          </View>
          <View style={styles.contactContent}>
            <Typography variant="h3">Husband - John</Typography>
            <Typography variant="caption" color={Theme.colors.textLight}>Primary Contact</Typography>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#34E875" />
        </TouchableOpacity>
      </Card>

      <Card style={styles.contactCard}>
        <View style={styles.contactInfo}>
          <View style={[styles.contactIcon, { backgroundColor: '#F5F0FF' }]}>
            <Ionicons name="person" size={20} color="#6A1B9A" />
          </View>
          <View style={styles.contactContent}>
            <Typography variant="h3">Sister - Mary</Typography>
            <Typography variant="caption" color={Theme.colors.textLight}>Secondary Contact</Typography>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#34E875" />
        </TouchableOpacity>
      </Card>

      {/* Clinic Info */}
      <View style={styles.sectionHeader}>
        <Typography variant="h2">My Clinic Info</Typography>
      </View>

      <Card style={styles.clinicCard}>
        <View style={styles.clinicHeader}>
          <View style={[styles.clinicIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="medical" size={20} color="#C62828" />
          </View>
          <View style={styles.clinicContent}>
            <Typography variant="h3">City Health Center</Typography>
            <Typography variant="caption" color={Theme.colors.textLight}>123 Main St, Central District</Typography>
            <Typography variant="caption" color={Theme.colors.textLight}>Open: 8:00 AM - 6:00 PM</Typography>
          </View>
        </View>

        <View style={styles.clinicActions}>
          <Button 
            title="Call Clinic" 
            variant="outline" 
            containerStyle={styles.clinicActionButton} 
            icon={<Ionicons name="call-outline" size={18} />}
          />
          <Button 
            title="Directions" 
            variant="outline" 
            containerStyle={styles.clinicActionButton}
            icon={<Ionicons name="navigate-outline" size={18} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  iconButton: {
    padding: 4,
  },
  editText: {
    color: '#34E875',
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.m,
  },
  avatarOutline: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Theme.colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34E875',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.white,
  },
  userName: {
    marginBottom: Theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  statusCheckContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    marginBottom: 2,
  },
  historyButton: {
    backgroundColor: '#34E875',
    height: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.s,
  },
  actionLinkText: {
    color: '#34E875',
    fontWeight: 'bold',
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.s,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  contactContent: {
    justifyContent: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clinicCard: {
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.xl,
  },
  clinicHeader: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.m,
  },
  clinicIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  clinicContent: {
    flex: 1,
  },
  clinicActions: {
    flexDirection: 'row',
    gap: Theme.spacing.s,
  },
  clinicActionButton: {
    flex: 1,
    height: 44,
    paddingVertical: 0,
    backgroundColor: '#F7FAFC',
    borderColor: '#E2E8F0',
  },
});
