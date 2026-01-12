import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

import { useHealthData } from '../hooks/useHealthData';

export default function BPEntryScreen() {
  const router = useRouter();
  const { addBP, isAddingBP } = useHealthData();
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');

  const handleSave = async () => {
    try {
      await addBP({ 
        systolic: parseInt(systolic), 
        diastolic: parseInt(diastolic) 
      });

      // Clinical safety: navigate based on the reading itself as well
      if (parseInt(systolic) > 160 || parseInt(diastolic) > 110) {
        router.push('/emergency');
      } else if (parseInt(systolic) > 140 || parseInt(diastolic) > 90) {
        router.push('/nurse-summary');
      } else {
        router.back();
      }
    } catch (error) {
      // Error is handled by global interceptor, but we can add local UI feedback if needed
      console.error('Failed to save BP reading', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitle}>Log Blood Pressure</Typography>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.timeBadgeContainer}>
          <View style={styles.timeBadge}>
            <Ionicons name="calendar" size={18} color={Theme.colors.primary} />
            <Typography variant="h3" style={styles.timeText}>Today, 10:42 AM</Typography>
          </View>
        </View>

        <Typography variant="body" style={styles.instructionText}>
          Enter the numbers exactly as they appear on your machine.
        </Typography>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Systolic Card */}
          <View style={styles.inputCard}>
            <View style={styles.cardHeader}>
              <Typography variant="h2" style={styles.cardLabel}>Systolic (Top)</Typography>
              <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                value={systolic}
                onChangeText={setSystolic}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
              />
              <Typography variant="h3" style={styles.unitText}>mmHg</Typography>
            </View>
            <Typography variant="caption" style={styles.rangeText}>Normal range is around 90-120</Typography>
          </View>

          {/* Diastolic Card */}
          <View style={styles.inputCard}>
            <View style={styles.cardHeader}>
              <Typography variant="h2" style={styles.cardLabel}>Diastolic (Bottom)</Typography>
              <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                value={diastolic}
                onChangeText={setDiastolic}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
              />
              <Typography variant="h3" style={styles.unitText}>mmHg</Typography>
            </View>
            <Typography variant="caption" style={styles.rangeText}>Normal range is around 60-80</Typography>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoIconBg}>
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
            </View>
            <Typography variant="body" style={styles.infoText}>
              Rest for 5 minutes before taking your reading for the most accurate result.
            </Typography>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveButton, isAddingBP && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isAddingBP}
          >
            <Typography variant="h2" style={styles.saveButtonText}>
              {isAddingBP ? 'Saving...' : 'Save Reading'}
            </Typography>
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingHorizontal: Theme.spacing.l,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.m,
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  timeBadgeContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    ...Theme.shadows.light,
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    textAlign: 'center',
    color: Theme.colors.textLight,
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: Theme.spacing.l,
    marginBottom: Theme.spacing.l,
    ...Theme.shadows.light,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: '900',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FCF1',
    borderRadius: 30,
    paddingHorizontal: 24,
    height: 56,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: Theme.typography.fontFamilies.bold,
    color: Theme.colors.primary,
  },
  unitText: {
    color: 'rgba(45, 228, 116, 0.6)',
    fontFamily: Theme.typography.fontFamilies.bold,
  },
  rangeText: {
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: Theme.spacing.m,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    marginTop: Theme.spacing.m,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: '#1E40AF',
    lineHeight: 20,
    fontSize: 15,
  },
  footer: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  saveButtonText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});
