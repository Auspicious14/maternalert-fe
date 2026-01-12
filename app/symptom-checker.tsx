import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const SYMPTOMS = [
  { id: 'HEADACHE', title: 'Severe Headache', icon: 'flash' },
  { id: 'BLURRED_VISION', title: 'Blurred Vision', icon: 'grid' },
  { id: 'SWELLING', title: 'Swelling', subtitle: 'Hands or face', icon: 'hand-left' },
  { id: 'UPPER_ABDOMINAL_PAIN', title: 'Stomach Pain', icon: 'sad' },
];

import { useHealthData } from '../hooks/useHealthData';

export default function SymptomCheckerScreen() {
  const router = useRouter();
  const { addSymptom, isAddingSymptom } = useHealthData();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSymptom = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;

    try {
      // Backend handles one symptom per record, so we submit sequentially
      // This ensures each symptom gets its own timestamped record
      for (const symptomId of selected) {
        await addSymptom(symptomId);
      }
      
      router.push('/symptom-results');
    } catch (error) {
      console.error('Failed to submit symptoms', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitle}>Check Symptoms</Typography>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Typography variant="h1" style={styles.title}>How are you feeling today?</Typography>
          <Typography variant="body" style={styles.subtitle}>
            Select any symptoms you are experiencing right now.
          </Typography>

          <View style={styles.optionsContainer}>
            {SYMPTOMS.map((symptom) => (
              <TouchableOpacity 
                key={symptom.id}
                style={[styles.optionCard, selected.includes(symptom.id) && styles.optionCardSelected]}
                onPress={() => toggleSymptom(symptom.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBg, { backgroundColor: Theme.colors.primaryLight }]}>
                  <Ionicons name={symptom.icon as any} size={24} color={Theme.colors.primary} />
                </View>
                <View style={styles.optionInfo}>
                  <Typography variant="h3" style={styles.optionTitle}>{symptom.title}</Typography>
                  {symptom.subtitle && (
                    <Typography variant="caption" style={styles.optionSubtitle}>{symptom.subtitle}</Typography>
                  )}
                </View>
                <View style={[styles.radio, selected.includes(symptom.id) && styles.radioSelected]}>
                  {selected.includes(symptom.id) && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitButton, (isAddingSymptom || selected.length === 0) && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isAddingSymptom || selected.length === 0}
          >
            <Typography variant="h2" style={styles.submitText}>
              {isAddingSymptom ? 'Reporting...' : 'Submit Report'}
            </Typography>
            {!isAddingSymptom && <Ionicons name="arrow-forward" size={24} color="#1A212E" />}
          </TouchableOpacity>
          <Typography variant="caption" style={styles.footerText}>All data is kept private and secure.</Typography>
        </View>

        {/* Tab Mockup for fidelity */}
        <View style={styles.tabBarMock}>
           <View style={styles.tabItem}>
              <Ionicons name="home" size={24} color={Theme.colors.textLight} />
              <Typography variant="caption" style={{ color: Theme.colors.textLight }}>Home</Typography>
           </View>
           <View style={styles.tabItemActive}>
              <View style={styles.activeIndicator}>
                <Ionicons name="medical" size={24} color={Theme.colors.primary} />
              </View>
              <Typography variant="caption" style={{ color: Theme.colors.primary, fontWeight: 'bold' }}>Checkup</Typography>
           </View>
           <View style={styles.tabItem}>
              <Ionicons name="person" size={24} color={Theme.colors.textLight} />
              <Typography variant="caption" style={{ color: Theme.colors.textLight }}>Profile</Typography>
           </View>
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
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.l,
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    color: Theme.colors.textLight,
    lineHeight: 24,
    fontSize: 18,
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingVertical: 24,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  optionCardSelected: {
    borderColor: Theme.colors.primary,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    color: '#94A3B8',
  },
  radio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#CBD5E0',
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#CBD5E0',
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 100,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    width: '100%',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  submitText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  footerText: {
    color: Theme.colors.textLight,
  },
  tabBarMock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 40,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabItemActive: {
    alignItems: 'center',
    gap: 4,
  },
  activeIndicator: {
    backgroundColor: '#E8FCF1',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
