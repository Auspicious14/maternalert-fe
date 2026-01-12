import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function EmergencyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor={Theme.colors.darkBg}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Ionicons name="warning" size={24} color={Theme.colors.emergency} />
            <Typography variant="h3" style={styles.headerText}>EMERGENCY ALERT</Typography>
          </View>
          <View style={styles.statusDot} />
        </View>

        <View style={styles.content}>
          <View style={styles.bpContainer}>
            <Typography variant="caption" style={styles.bpLabel}>CURRENT BP READING</Typography>
            <View style={styles.bpValueRow}>
              <Typography variant="h1" style={styles.bpMain}>165</Typography>
              <Typography variant="h1" style={styles.bpSeparator}>/</Typography>
              <Typography variant="h1" style={styles.bpMain}>110</Typography>
            </View>
            <View style={styles.criticalBadge}>
              <Ionicons name="stats-chart" size={14} color={Theme.colors.emergency} />
              <Typography variant="caption" style={styles.criticalText}>CRITICAL LEVEL</Typography>
            </View>
          </View>

          {/* Emergency Contact Avatar */}
          <View style={styles.contactContainer}>
            <View style={styles.avatarOuterCircle}>
              <View style={styles.avatarInnerCircle}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop' }} 
                  style={styles.avatarImage} 
                />
              </View>
            </View>
            <Typography variant="h1" style={styles.contactName}>Husband</Typography>
          </View>

          {/* CALL NOW Button */}
          <TouchableOpacity 
            style={styles.callNowButton} 
            activeOpacity={0.8}
            onPress={() => console.log('Calling emergency contact...')}
          >
            <Ionicons name="call" size={32} color={Theme.colors.white} />
            <Typography variant="h1" style={styles.callNowText}>CALL NOW</Typography>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Typography variant="caption" style={styles.dividerText}>OR MEDICAL HELP</Typography>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Action */}
          <TouchableOpacity 
            style={styles.secondaryActionCard}
            onPress={() => router.push('/clinic-finder')}
          >
            <View style={styles.secondaryIconBg}>
              <Ionicons name="add-circle" size={24} color={Theme.colors.emergency} />
            </View>
            <Typography variant="h2" style={styles.secondaryText}>Call Local Clinic</Typography>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.darkBg,
  },
  container: {
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    paddingTop: Theme.spacing.m,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  bpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bpLabel: {
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: Theme.spacing.s,
  },
  bpValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpMain: {
    fontSize: 80,
    color: Theme.colors.emergency,
    fontWeight: '900',
  },
  bpSeparator: {
    fontSize: 60,
    color: 'rgba(255,75,75,0.3)',
    marginHorizontal: 4,
    fontWeight: '300',
  },
  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,75,75,0.3)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: Theme.spacing.m,
    backgroundColor: 'rgba(255,75,75,0.05)',
  },
  criticalText: {
    color: Theme.colors.emergency,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  contactContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  avatarOuterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,75,75,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  avatarInnerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Theme.colors.emergency,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  contactName: {
    color: Theme.colors.white,
    fontSize: 36,
    fontWeight: '900',
  },
  callNowButton: {
    backgroundColor: Theme.colors.emergency,
    width: '100%',
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
    shadowColor: Theme.colors.emergency,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  callNowText: {
    color: Theme.colors.white,
    fontSize: 28,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: Theme.spacing.m,
    marginBottom: Theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.borderDark,
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
    padding: Theme.spacing.m,
    borderWidth: 1,
    borderColor: Theme.colors.borderDark,
  },
  secondaryIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,75,75,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  secondaryText: {
    flex: 1,
    color: Theme.colors.white,
    fontSize: 18,
  },
});
