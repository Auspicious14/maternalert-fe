import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

import { useHealthData } from '../hooks/useHealthData';

export default function NurseSummaryScreen() {
  const router = useRouter();
  const { latestBP, recentSymptoms } = useHealthData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#FFFFFF">
        {/* Urgent Header Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="warning" size={60} color="#FFFFFF" opacity={0.3} style={styles.bannerIconBg} />
            <Ionicons name="alert-circle" size={80} color="#FFFFFF" />
          </View>
          <Typography variant="h1" style={styles.bannerTitle}>
            GO TO THE NEAREST HEALTH FACILITY NOW
          </Typography>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Nurse Card */}
          <Card style={styles.nurseCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBg}>
                <Ionicons name="medical" size={24} color={Theme.colors.emergency} />
              </View>
              <Typography variant="h2" style={styles.cardTitle}>SHOW THIS TO THE NURSE</Typography>
            </View>

            <View style={styles.divider} />

            {/* Clinical Data Section */}
            <View style={styles.dataRow}>
              <Ionicons name="checkmark-circle" size={24} color={Theme.colors.emergency} />
              <View style={styles.dataContent}>
                <Typography variant="h3" style={styles.dataLabel}>
                  Blood Pressure: <Typography variant="h3" style={{ fontWeight: '900' }}>{latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : 'Not recorded'}</Typography>
                </Typography>
                <Typography variant="caption" style={styles.statusLabel}>
                  ({latestBP?.systolic && latestBP.systolic > 140 ? 'CRITICAL' : 'ELEVATED'})
                </Typography>
              </View>
            </View>

            {recentSymptoms?.map((symptom) => (
              <View key={symptom.id} style={styles.dataRow}>
                <Ionicons name="checkmark-circle-outline" size={24} color={Theme.colors.text} />
                <Typography variant="h3" style={styles.dataText}>
                  {symptom.symptomType.replace(/_/g, ' ')} detected
                </Typography>
              </View>
            ))}

            {(!recentSymptoms || recentSymptoms.length === 0) && (
              <View style={styles.dataRow}>
                <Ionicons name="information-circle-outline" size={24} color={Theme.colors.textLight} />
                <Typography variant="h3" style={[styles.dataText, { color: Theme.colors.textLight }]}>
                  No other symptoms reported
                </Typography>
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.8}>
               <Ionicons name="call" size={24} color="#FFFFFF" />
               <View style={styles.buttonContent}>
                 <Typography variant="h3" style={styles.buttonText}>Call Emergency</Typography>
                 <Typography variant="caption" style={styles.buttonSubtext}>Contacting: Husband (David)</Typography>
               </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.midwifeButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/clinic-finder')}
            >
               <Ionicons name="people" size={24} color="#FFFFFF" />
               <Typography variant="h3" style={styles.buttonText}>Show to Midwife</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backHome} onPress={() => router.replace('/(tabs)')}>
               <Ionicons name="home" size={18} color={Theme.colors.textLight} />
               <Typography variant="body" style={styles.backHomeText}>False Alarm? Return to Home</Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.emergency,
  },
  container: {
    paddingHorizontal: 0,
  },
  banner: {
    backgroundColor: Theme.colors.emergency,
    paddingVertical: 40,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  bannerIconContainer: {
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconBg: {
    position: 'absolute',
  },
  bannerTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 38,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.l,
    paddingTop: 30,
    paddingBottom: 40,
  },
  nurseCard: {
    borderRadius: 32,
    padding: Theme.spacing.l,
    marginBottom: 40,
    borderLeftWidth: 8,
    borderLeftColor: Theme.colors.emergency,
    backgroundColor: '#FFFFFF',
    ...Theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 25,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 18,
  },
  statusLabel: {
    color: Theme.colors.emergency,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 1,
  },
  dataText: {
    fontSize: 18,
    color: Theme.colors.text,
  },
  actions: {
    gap: 16,
  },
  emergencyButton: {
    backgroundColor: '#121915', // Dark charcoal from mockup
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 16,
  },
  midwifeButton: {
    backgroundColor: Theme.colors.primary,
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonContent: {
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  backHome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  backHomeText: {
    color: Theme.colors.textLight,
    fontWeight: 'bold',
  },
});
