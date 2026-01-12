import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

import { useUserProfile } from '../hooks/useUserProfile';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { createProfile, isCreatingProfile } = useUserProfile();
  const [step, setStep] = useState(3); // Medical History step (Mocked as Step 3 for fidelity focus)
  const totalSteps = 4;

  const [conditions, setConditions] = useState<string[]>([]);

  const toggleCondition = (id: string) => {
    if (conditions.includes(id)) {
      setConditions(conditions.filter(c => c !== id));
    } else {
      setConditions([...conditions, id]);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        // Map frontend IDs to backend enums
        const mappedConditions = conditions.map(c => {
          switch(c) {
            case 'hbp': return 'CHRONIC_HYPERTENSION';
            case 'diabetes': return 'GESTATIONAL_DIABETES';
            case 'twins': return 'MULTIPLE_PREGNANCY';
            case 'kidney': return 'KIDNEY_DISEASE';
            default: return 'NONE';
          }
        });

        // Mock data for other fields for demonstration
        await createProfile({
          ageRange: 'AGE_18_34',
          pregnancyWeeks: 24,
          firstPregnancy: true,
          knownConditions: mappedConditions.length > 0 ? mappedConditions : ['NONE'],
        });

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} scrollable backgroundColor="#F9FAFB">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitle}>Medical History</Typography>
          <View style={{ width: 28 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Typography variant="caption" style={styles.progressLabel}>Your Progress</Typography>
            <Typography variant="caption" style={styles.progressStep}>Step {step} of {totalSteps}</Typography>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Typography variant="h1" style={styles.title}>Have you ever had any of these conditions?</Typography>

          <View style={styles.optionsContainer}>
            <ConditionItem 
              id="hbp"
              title="High blood pressure"
              subtitle="Before this pregnancy"
              selected={conditions.includes('hbp')}
              onPress={() => toggleCondition('hbp')}
            />
            <ConditionItem 
              id="diabetes"
              title="Diabetes"
              subtitle="Sugar problems"
              selected={conditions.includes('diabetes')}
              onPress={() => toggleCondition('diabetes')}
            />
            <ConditionItem 
              id="twins"
              title="Twins or more"
              subtitle="Multiples like triplets"
              selected={conditions.includes('twins')}
              onPress={() => toggleCondition('twins')}
            />
            <ConditionItem 
              id="kidney"
              title="Kidney problems"
              subtitle="Ongoing issues with kidneys"
              selected={conditions.includes('kidney')}
              onPress={() => toggleCondition('kidney')}
            />
          </View>

          <TouchableOpacity style={styles.noneButton}>
             <Typography variant="h3" style={styles.noneText}>None of these apply to me</Typography>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.continueButton, isCreatingProfile && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={isCreatingProfile}
          >
            <Typography variant="h2" style={styles.continueText}>
              {isCreatingProfile ? 'Saving...' : 'Continue'}
            </Typography>
            {!isCreatingProfile && <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

function ConditionItem({ id, title, subtitle, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.conditionCard, selected && styles.conditionCardSelected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.conditionInfo}>
        <Typography variant="h3" style={styles.conditionTitle}>{title}</Typography>
        <Typography variant="caption" style={styles.conditionSubtitle}>{subtitle}</Typography>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color="#1E6BFF" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.m,
    marginBottom: Theme.spacing.l,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressSection: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: 40,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: Theme.colors.textLight,
  },
  progressStep: {
    color: '#1E6BFF',
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E6BFF',
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  conditionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 24,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  conditionCardSelected: {
    borderColor: '#1E6BFF',
    backgroundColor: '#F0F7FF',
  },
  conditionInfo: {
    flex: 1,
  },
  conditionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  conditionSubtitle: {
    color: Theme.colors.textLight,
  },
  checkbox: {
    width: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#1E6BFF',
    backgroundColor: '#FFFFFF',
  },
  noneButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  noneText: {
    color: '#1E6BFF',
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 30,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: '#1E6BFF',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#1E6BFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
