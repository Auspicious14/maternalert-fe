import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';

import { useHealthData } from '../../hooks/useHealthData';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function TrackingScreen() {
  const { bpHistory, recentSymptoms } = useHealthData();
  const { profile } = useUserProfile();

  // Calculate average BP
  const avgBP = React.useMemo(() => {
    if (!bpHistory || bpHistory.length === 0) return null;
    const sysSum = bpHistory.reduce((acc, curr) => acc + curr.systolic, 0);
    const diaSum = bpHistory.reduce((acc, curr) => acc + curr.diastolic, 0);
    return {
      systolic: Math.round(sysSum / bpHistory.length),
      diastolic: Math.round(diaSum / bpHistory.length),
    };
  }, [bpHistory]);

  const weekDays = [
    { day: 'M', date: '12', current: false, status: 'stable' },
    { day: 'T', date: '13', current: false, status: 'stable' },
    { day: 'W', date: '14', current: true, status: 'urgent' },
    { day: 'T', date: '15', current: false, status: 'none' },
    { day: 'F', date: '16', current: false, status: 'none' },
    { day: 'S', date: '17', current: false, status: 'none' },
    { day: 'S', date: '18', current: false, status: 'none' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor={Theme.colors.darkBg}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>Health Tracking</Typography>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Summary Banner */}
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
               <View style={styles.summaryInfo}>
                  <Typography variant="h3" style={styles.summaryTitle}>
                    {profile?.pregnancyWeeks || '24'} Weeks Pregnant
                  </Typography>
                  <Typography variant="caption" style={styles.summarySubtitle}>
                    {profile?.firstPregnancy ? 'First Pregnancy' : 'Healthy Progress'}
                  </Typography>
               </View>
               <View style={styles.babyIconBg}>
                  <Ionicons name="fitness" size={24} color={Theme.colors.primary} />
               </View>
            </View>
            <View style={styles.progressContainer}>
               <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${((profile?.pregnancyWeeks || 24) / 40) * 100}%` }]} />
               </View>
               <Typography variant="caption" style={styles.progressText}>
                 {Math.round(((profile?.pregnancyWeeks || 24) / 40) * 100)}% complete
               </Typography>
            </View>
          </Card>

          {/* Calendar Strip (Fidelity Focused) */}
          <View style={styles.calendarStrip}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.dayItem}>
                <Typography variant="caption" style={styles.dayLabel}>{item.day}</Typography>
                <View style={[
                  styles.dateCircle, 
                  item.current && styles.dateCircleActive,
                  item.status === 'stable' && styles.dateCircleStable,
                  item.status === 'urgent' && styles.dateCircleUrgent
                ]}>
                  <Typography variant="body" style={[styles.dateText, (item.current || item.status !== 'none') && styles.dateTextActive]}>
                    {item.date}
                  </Typography>
                </View>
                {item.current && <View style={styles.activeDot} />}
              </View>
            ))}
          </View>

          {/* Vitals Section */}
          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={styles.sectionTitle}>Vitals Overview</Typography>
          </View>

          <View style={styles.vitalsRow}>
            <Card style={styles.vitalCard}>
               <View style={[styles.vitalIcon, { backgroundColor: 'rgba(45, 228, 116, 0.1)' }]}>
                  <Ionicons name="pulse" size={20} color={Theme.colors.primary} />
               </View>
               <Typography variant="h2" style={styles.vitalValue}>
                 {avgBP ? `${avgBP.systolic}/${avgBP.diastolic}` : '--/--'}
               </Typography>
               <Typography variant="caption" style={styles.vitalLabel}>Avg. Blood Pressure</Typography>
            </Card>

            <Card style={styles.vitalCard}>
               <View style={[styles.vitalIcon, { backgroundColor: 'rgba(255, 155, 62, 0.1)' }]}>
                  <Ionicons name="body" size={20} color={Theme.colors.accent} />
               </View>
               <Typography variant="h2" style={styles.vitalValue}>--.- kg</Typography>
               <Typography variant="caption" style={styles.vitalLabel}>Current Weight</Typography>
            </Card>
          </View>

          {/* Logs */}
          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={styles.sectionTitle}>Daily Logs</Typography>
          </View>

          <Card style={styles.logItem}>
             <View style={[styles.logIcon, { backgroundColor: '#FF4B4B' }]}>
                <Ionicons name="sad" size={20} color="#FFFFFF" />
             </View>
             <View style={styles.logInfo}>
                <Typography variant="h3" style={styles.logTitle}>Symptoms</Typography>
                <Typography variant="caption" style={styles.logSubtitle}>
                  {recentSymptoms?.length || 0} signs reported recently
                </Typography>
             </View>
             <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
          </Card>
        </ScrollView>

        {/* FAB Refined */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
           <Ionicons name="add" size={32} color={Theme.colors.darkBg} />
        </TouchableOpacity>
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
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    color: Theme.colors.white,
    fontSize: 28,
    fontWeight: '900',
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: 24,
    borderRadius: 32,
    marginBottom: 40,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    color: Theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  summarySubtitle: {
    color: 'rgba(255,255,255,0.4)',
  },
  babyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 228, 116, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  dayItem: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleActive: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  dateCircleStable: {
    backgroundColor: Theme.colors.primary,
  },
  dateCircleUrgent: {
    backgroundColor: Theme.colors.accent,
  },
  dateText: {
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
  },
  dateTextActive: {
    color: Theme.colors.darkBg,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Theme.colors.white,
    fontSize: 20,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: 20,
    borderRadius: 28,
  },
  vitalIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalValue: {
    color: Theme.colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  vitalLabel: {
    color: 'rgba(255,255,255,0.4)',
  },
  logItem: {
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logSubtitle: {
    color: 'rgba(255,255,255,0.4)',
  },
  logValue: {
    color: '#1E6BFF',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
});
