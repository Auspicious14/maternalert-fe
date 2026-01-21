import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';
import { useHealthData } from '../../hooks/useHealthData';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function TrackingScreen() {
  const router = useRouter();
  const { bpHistory, recentSymptoms } = useHealthData();
  const { profile } = useUserProfile();
  
  

  // Calculate average BP
  const avgBP = useMemo(() => {
    if (!bpHistory || bpHistory.length === 0) return null;
    const sysSum = bpHistory.reduce((acc, curr) => acc + curr.systolic, 0);
    const diaSum = bpHistory.reduce((acc, curr) => acc + curr.diastolic, 0);
    return {
      systolic: Math.round(sysSum / bpHistory.length),
      diastolic: Math.round(diaSum / bpHistory.length),
    };
  }, [bpHistory]);

  // Generate current week days
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate offset to get to Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      
      const isToday = date.toDateString() === today.toDateString();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W...
      
      days.push({
        day: dayName,
        date: date.getDate().toString(),
        current: isToday,
        status: isToday ? 'stable' : 'none', // Simple logic for now
      });
    }
    return days;
  }, []);

  

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

          {/* Calendar Strip */}
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
          </View>

               <Typography variant="h2" style={styles.vitalValue}>
                 {avgBP ? `${avgBP.systolic}/${avgBP.diastolic}` : '--/--'}
               </Typography>
               <Typography variant="caption" style={styles.vitalLabel}>Avg. Blood Pressure</Typography>
            </Card>

            <TouchableOpacity 
              style={[styles.vitalCard, { padding: 0 }]} 
              onPress={() => setIsEditingWeight(true)}
              activeOpacity={0.9}
            >
              <Card style={{ flex: 1, padding: 16 }}>
                 <View style={[styles.vitalIcon, { backgroundColor: 'rgba(255, 155, 62, 0.1)' }]}>
                    <Ionicons name="body" size={20} color={Theme.colors.accent} />
                 </View>
                 {isEditingWeight ? (
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <TextInput 
                       value={weight}
                       onChangeText={setWeight}
                       keyboardType="numeric"
                       placeholder="0.0"
                       style={[styles.vitalValue, { minWidth: 60, borderBottomWidth: 1, borderColor: Theme.colors.border }]}
                       autoFocus
                       onBlur={handleSaveWeight}
                     />
                     <Typography variant="h2" style={styles.vitalValue}> kg</Typography>
                   </View>
                 ) : (
                   <Typography variant="h2" style={styles.vitalValue}>
                     {weight ? `${weight} kg` : '--.- kg'}
                   </Typography>
                 )}
                 <Typography variant="caption" style={styles.vitalLabel}>Current Weight</Typography>
              </Card>
            </TouchableOpacity>
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
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.9}
          onPress={() => router.push('/bp-entry')}
        >
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
    color: 'rgba(255,255,255,0.6)',
  },
  babyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(45, 228, 116, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.6)',
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
    textTransform: 'uppercase',
    fontSize: 12,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dateCircleActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dateCircleStable: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(45, 228, 116, 0.1)',
  },
  dateCircleUrgent: {
    borderColor: Theme.colors.emergency,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
  },
  dateText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  dateTextActive: {
    color: Theme.colors.white,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    marginTop: 4,
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
    marginBottom: 32,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
  },
  vitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalValue: {
    color: Theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vitalLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  logSubtitle: {
    color: 'rgba(255,255,255,0.5)',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
