import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const CLINICS = [
  { id: '1', name: 'West Health Center', distance: '0.8 km', status: 'Open Now', type: 'Clinic' },
  { id: '2', name: 'General Hospital', distance: '1.5 km', status: 'Open 24/7', type: 'Hospital' },
  { id: '3', name: 'Maternal Care Unit', distance: '2.4 km', status: 'Closed', type: 'Clinic' },
];

export default function ClinicFinderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitle}>Nearest Clinics</Typography>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar Refined */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search by clinic name..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Map Area Refined */}
        <View style={styles.mapContainer}>
          <View style={styles.mapBackground}>
             {/* Mock Map Lines/Shapes for visual interest */}
             <View style={[styles.mapLine, { top: 40, width: '100%' }]} />
             <View style={[styles.mapLine, { left: 100, height: '100%', width: 1 }]} />
             
             {/* Vibrant Pins */}
             <View style={[styles.pin, { top: 60, left: 140 }]}>
                <View style={styles.pinCircle}>
                  <Ionicons name="location" size={24} color={Theme.colors.primary} />
                </View>
                <View style={styles.pinLabel}>
                  <Typography variant="caption" style={styles.pinText}>West Health</Typography>
                </View>
             </View>

             <View style={[styles.pin, { top: 180, left: 240 }]}>
                <View style={[styles.pinCircle, { backgroundColor: '#1E6BFF' }]}>
                  <Ionicons name="location" size={24} color="#FFFFFF" />
                </View>
             </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Typography variant="h2" style={styles.listTitle}>Nearby Facilities</Typography>
          <TouchableOpacity>
             <Typography variant="body" style={styles.seeAll}>See All</Typography>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {CLINICS.map((clinic) => (
            <TouchableOpacity key={clinic.id} activeOpacity={0.9}>
              <Card style={styles.clinicCard}>
                <View style={styles.clinicIconBg}>
                   <Ionicons 
                    name={clinic.type === 'Hospital' ? 'business' : 'medical'} 
                    size={24} 
                    color={clinic.status === 'Closed' ? '#94A3B8' : Theme.colors.primary} 
                   />
                </View>
                <View style={styles.clinicDetails}>
                  <Typography variant="h3" style={styles.clinicName}>{clinic.name}</Typography>
                  <View style={styles.metaRow}>
                    <Typography variant="caption" style={styles.distance}>{clinic.distance}</Typography>
                    <View style={styles.dot} />
                    <Typography 
                      variant="caption" 
                      style={[styles.status, { color: clinic.status === 'Open Now' ? Theme.colors.primary : '#F43F5E' }]}
                    >
                      {clinic.status}
                    </Typography>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
           <TouchableOpacity style={styles.callAllButton}>
              <Ionicons name="call" size={24} color="#FFFFFF" />
              <Typography variant="h2" style={styles.callText}>Call Center</Typography>
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchWrapper: {
    paddingHorizontal: Theme.spacing.l,
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A212E',
    fontFamily: Theme.typography.fontFamilies.regular,
  },
  mapContainer: {
    paddingHorizontal: Theme.spacing.l,
    marginBottom: 40,
  },
  mapBackground: {
    height: 280,
    backgroundColor: '#EEF2F6',
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapLine: {
    position: 'absolute',
    backgroundColor: '#D1D5DB',
    height: 1,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8FCF1',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  pinLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pinText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 30,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  clinicIconBg: {
    width: 50,
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clinicDetails: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    color: '#64748B',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E0',
  },
  status: {
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 30,
    paddingTop: 10,
  },
  callAllButton: {
    backgroundColor: '#1E293B',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  callText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
