import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useUserProfile } from '../hooks/useUserProfile';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { createProfile, isCreatingProfile } = useUserProfile();
  const [step, setStep] = useState(2); // Starting at Step 2 as per user images
  const totalSteps = 4;

  // Form State
  const [weeks, setWeeks] = useState(24);
  const [conditions, setConditions] = useState<string[]>([]);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(null);

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
        const mappedConditions = conditions.map(c => {
          switch(c) {
            case 'hbp': return 'CHRONIC_HYPERTENSION';
            case 'diabetes': return 'GESTATIONAL_DIABETES';
            case 'twins': return 'MULTIPLE_PREGNANCY';
            case 'kidney': return 'KIDNEY_DISEASE';
            default: return 'NONE';
          }
        });

        await createProfile({
          ageRange: 'AGE_18_34',
          pregnancyWeeks: weeks,
          firstPregnancy: isFirstPregnancy ?? true,
          knownConditions: mappedConditions.length > 0 ? mappedConditions : ['NONE'],
        });

        router.replace('/(tabs)');
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 2:
        return (
          <View style={styles.stepContent}>
            <Typography variant="h1" weight="bold" style={styles.title}>How many weeks{"\n"}pregnant are you?</Typography>
            <Typography variant="body" style={styles.subtitle}>If you aren't sure, give your best guess.</Typography>
            
            <View style={styles.weeksValueContainer}>
              <Typography variant="h1" weight="bold" style={styles.weeksNumber}>{weeks}</Typography>
              <Typography variant="h3" style={styles.weeksLabel}>Weeks</Typography>
            </View>

            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                style={styles.stepButton} 
                onPress={() => setWeeks(Math.max(0, weeks - 1))}
              >
                <Ionicons name="remove" size={32} color={Theme.colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.sliderTrack}>
                <View style={styles.sliderLine} />
                <View style={[styles.sliderFill, { width: `${(weeks / 42) * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${(weeks / 42) * 100}%` }]} />
              </View>

              <TouchableOpacity 
                style={[styles.stepButton, { backgroundColor: Theme.colors.primary }]} 
                onPress={() => setWeeks(Math.min(42, weeks + 1))}
              >
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.rangeLabels}>
              <Typography variant="caption" style={styles.rangeText}>0 Weeks</Typography>
              <Typography variant="caption" style={styles.rangeText}>42 Weeks</Typography>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Typography variant="h1" weight="bold" style={styles.title}>Have you ever had any of these conditions?</Typography>
            
            <View style={styles.optionsContainer}>
              <ConditionItem 
                title="High blood pressure"
                subtitle="Before this pregnancy"
                selected={conditions.includes('hbp')}
                onPress={() => toggleCondition('hbp')}
              />
              <ConditionItem 
                title="Diabetes"
                subtitle="Sugar problems"
                selected={conditions.includes('diabetes')}
                onPress={() => toggleCondition('diabetes')}
              />
              <ConditionItem 
                title="Twins or more"
                subtitle="Multiples like triplets"
                selected={conditions.includes('twins')}
                onPress={() => toggleCondition('twins')}
              />
              <ConditionItem 
                title="Kidney problems"
                subtitle="Ongoing issues with kidneys"
                selected={conditions.includes('kidney')}
                onPress={() => toggleCondition('kidney')}
              />
            </View>

            <TouchableOpacity style={styles.noneButton}>
               <Typography variant="h3" weight="bold" style={styles.noneText}>None of these apply to me</Typography>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Typography variant="h1" weight="bold" style={styles.title}>Is this your first pregnancy?</Typography>
            
            <View style={styles.pregnancyOptions}>
              <TouchableOpacity 
                style={[styles.pregnancyCard, isFirstPregnancy === true && styles.pregnancyCardSelected]}
                onPress={() => setIsFirstPregnancy(true)}
              >
                <View style={[styles.pregIconContainer, { backgroundColor: '#E0FAEB' }]}>
                   <Ionicons name="happy-outline" size={40} color={Theme.colors.primary} />
                </View>
                <Typography variant="h2" weight="bold" style={styles.pregCardText}>Yes</Typography>
                {isFirstPregnancy === true && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.pregnancyCard, isFirstPregnancy === false && styles.pregnancyCardSelected]}
                onPress={() => setIsFirstPregnancy(false)}
              >
                <View style={[styles.pregIconContainer, { backgroundColor: '#F3F4F6' }]}>
                   <Ionicons name="people-outline" size={40} color="#6B7280" />
                </View>
                <Typography variant="h2" weight="bold" style={styles.pregCardText}>No</Typography>
                {isFirstPregnancy === false && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Typography variant="body" style={styles.infoText}>
              This helps us provide the most relevant health tips and tracking for your specific needs.
            </Typography>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" style={styles.headerTitle}>Profile Setup</Typography>
          <View style={{ width: 28 }} />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Typography variant="caption" style={styles.progressLabel}>
              {step === 4 ? 'Final Step' : `STEP ${step} OF ${totalSteps}`}
            </Typography>
            <Typography variant="caption" weight="bold" style={styles.progressStep}>
              {step} of {totalSteps}
            </Typography>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.continueButton, (step === 4 && isFirstPregnancy === null) && { opacity: 0.5 }]} 
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={isCreatingProfile || (step === 4 && isFirstPregnancy === null)}
          >
            <Typography variant="h2" weight="bold" style={styles.continueText}>
              {step === 4 ? 'Finish Profile' : 'Next'}
            </Typography>
            {step !== 4 && <Ionicons name="arrow-forward" size={24} color="#121915" />}
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

function ConditionItem({ title, subtitle, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.conditionCard, selected && styles.conditionCardSelected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.conditionInfo}>
        <Typography variant="h3" weight="bold" style={styles.conditionTitle}>{title}</Typography>
        <Typography variant="caption" style={styles.conditionSubtitle}>{subtitle}</Typography>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color={Theme.colors.primary} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.m,
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
  },
  progressSection: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: 30,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: Theme.colors.textLight,
    letterSpacing: 0.5,
  },
  progressStep: {
    color: '#1A212E',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  stepContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 15,
    textAlign: 'center',
    color: '#121915',
  },
  subtitle: {
    textAlign: 'center',
    color: Theme.colors.textLight,
    marginBottom: 40,
  },
  weeksValueContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  weeksNumber: {
    fontSize: 100,
    lineHeight: 110,
    color: '#121915',
  },
  weeksLabel: {
    fontSize: 24,
    color: '#64748B',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  stepButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.light,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sliderTrack: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderLine: {
    height: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 4,
    width: '100%',
  },
  sliderFill: {
    height: 8,
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
    position: 'absolute',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    position: 'absolute',
    marginLeft: -12,
    ...Theme.shadows.light,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  rangeText: {
    color: '#94A3B8',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  conditionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  conditionCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#F7FFF9',
  },
  conditionInfo: {
    flex: 1,
  },
  conditionTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  conditionSubtitle: {
    color: Theme.colors.textLight,
    fontSize: 14,
  },
  checkbox: {
    width: 28,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#FFFFFF',
  },
  noneButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  noneText: {
    color: Theme.colors.setupBlue,
  },
  pregnancyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 40,
    gap: 16,
  },
  pregnancyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F1F5F9',
    position: 'relative',
    ...Theme.shadows.light,
  },
  pregnancyCardSelected: {
    borderColor: Theme.colors.primary,
  },
  pregIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pregCardText: {
    fontSize: 22,
  },
  checkBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: SCREEN_HEIGHT < 700 ? 15 : 30,
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Theme.shadows.medium,
  },
  continueText: {
    color: '#121915',
    fontSize: 22,
  },
});
