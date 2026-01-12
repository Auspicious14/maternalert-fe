import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function SymptomResultsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} scrollable backgroundColor="#F9FAFB">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitle}>Care Recommendation</Typography>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Level Radial Indicator Mockup */}
          <View style={styles.radialContainer}>
            <View style={styles.radialOuter}>
               <View style={styles.radialInner}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="medical" size={40} color={Theme.colors.accent} />
                  </View>
                  <View style={styles.warningBadge}>
                    <Ionicons name="warning" size={16} color={Theme.colors.accent} />
                  </View>
               </View>
            </View>
            <Typography variant="h1" style={styles.levelTitle}>Orange Level</Typography>
            <Typography variant="h2" style={styles.levelSubTitle}>Medical review recommended soon</Typography>
          </View>

          <Card style={styles.infoCard}>
             <View style={styles.infoRow}>
               <Ionicons name="medical" size={24} color={Theme.colors.primary} />
               <Typography variant="body" style={styles.infoText}>
                 Based on your symptoms and blood pressure reading, please visit your clinic <Typography variant="h3" style={{ fontWeight: 'bold' }}>today</Typography>.
               </Typography>
             </View>
             <View style={styles.timeRow}>
                <Ionicons name="time" size={18} color={Theme.colors.textLight} />
                <Typography variant="caption" style={styles.timeText}>Last reading: 10 mins ago</Typography>
             </View>
          </Card>

          {/* Nearest Clinic Mockup */}
          <View style={styles.clinicCard}>
             <View style={styles.clinicInfo}>
               <Typography variant="h3" style={styles.clinicTitle}>Nearest Clinic</Typography>
               <Typography variant="caption" style={styles.clinicSubtitle}>1.2km away • Open now</Typography>
             </View>
             <TouchableOpacity style={styles.directionsButton}>
                <Ionicons name="navigate" size={20} color="#1A212E" />
             </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.findClinicButton} 
              onPress={() => router.push('/clinic-finder')}
            >
              <Ionicons name="location" size={24} color="#1A212E" />
              <Typography variant="h2" style={styles.actionText}>Find nearest clinic</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.callContactButton}
              onPress={() => router.push('/emergency')}
            >
              <Ionicons name="call" size={24} color={Theme.colors.urgentText} />
              <Typography variant="h2" style={[styles.actionText, { color: Theme.colors.urgentText }]}>Call emergency contact</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backHome} onPress={() => router.replace('/(tabs)')}>
               <Typography variant="h3" style={styles.backHomeText}>Back to Home</Typography>
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
    marginBottom: 20,
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  radialContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  radialOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  radialInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFE8D1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  warningBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: Theme.colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    ...Theme.shadows.light,
  },
  levelTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.colors.accent,
    marginBottom: 8,
  },
  levelSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 28,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    lineHeight: 24,
    fontSize: 18,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  timeText: {
    color: Theme.colors.textLight,
  },
  clinicCard: {
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicTitle: {
    fontWeight: '900',
  },
  clinicSubtitle: {
    color: Theme.colors.textLight,
  },
  directionsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.light,
  },
  actions: {
    gap: 16,
  },
  findClinicButton: {
    backgroundColor: Theme.colors.primary,
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  callContactButton: {
    backgroundColor: '#FFF4E8',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  backHome: {
    alignItems: 'center',
    marginTop: 10,
  },
  backHomeText: {
    color: Theme.colors.textLight,
    fontWeight: 'bold',
  },
});
