import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { StatusBanner } from '../../components/shared/StatusBanner';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';

export default function EducationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} scrollable backgroundColor="#F9FAFB">
        <StatusBanner 
          message="OFFLINE MODE ACTIVE" 
          icon={<Ionicons name="cloud-offline" size={16} color="#FFFFFF" />}
        />

        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>Education Hub</Typography>
          <Typography variant="body" style={styles.subtitle}>Verified pregnancy advice and care tips.</Typography>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Featured Card */}
          <TouchableOpacity activeOpacity={0.9}>
            <Card style={styles.featuredCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop' }} 
                style={styles.featuredImage}
              />
              <View style={styles.featuredOverlay}>
                 <View style={styles.playIconBg}>
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                 </View>
                 <View>
                   <Typography variant="h2" style={styles.featuredTitle}>Know your movements</Typography>
                   <Typography variant="caption" style={styles.featuredSubtitle}>Guide • 4 mins video</Typography>
                 </View>
              </View>
            </Card>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={styles.sectionTitle}>Essential Topics</Typography>
          </View>

          <View style={styles.topicsGrid}>
            <TopicCard 
              title="Danger Signs" 
              icon="warning" 
              color="#F43F5E" 
              bg="#FFF1F2" 
            />
            <TopicCard 
              title="Healthy Diet" 
              icon="leaf" 
              color="#10B981" 
              bg="#ECFDF5" 
            />
            <TopicCard 
              title="Mental Health" 
              icon="heart" 
              color="#8B5CF6" 
              bg="#F5F3FF" 
            />
            <TopicCard 
              title="Labor Prep" 
              icon="bed" 
              color="#3B82F6" 
              bg="#EFF6FF" 
            />
          </View>

          {/* Myths vs Facts Section */}
          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={styles.sectionTitle}>Myths vs Facts</Typography>
          </View>

          <TouchableOpacity style={styles.mythCard}>
             <View style={styles.mythHeader}>
                <View style={styles.mythBadge}>
                  <Typography variant="caption" style={styles.mythBadgeText}>MYTH</Typography>
                </View>
                <Typography variant="h3" style={styles.mythText}>Drinking cold water causes flu in the baby.</Typography>
             </View>
             <View style={styles.factRow}>
                <View style={styles.factBadge}>
                  <Typography variant="caption" style={styles.factBadgeText}>FACT</Typography>
                </View>
                <Typography variant="body" style={styles.factText}>Cold water does not affect the baby's health in the womb.</Typography>
             </View>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

function TopicCard({ title, icon, color, bg }: any) {
  return (
    <TouchableOpacity style={styles.topicCard} activeOpacity={0.7}>
      <View style={[styles.topicIconBg, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Typography variant="h3" style={styles.topicTitle}>{title}</Typography>
    </TouchableOpacity>
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
    paddingHorizontal: Theme.spacing.xl,
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Theme.colors.textLight,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 40,
  },
  featuredCard: {
    height: 240,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 40,
    backgroundColor: '#1A212E',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 30,
    justifyContent: 'space-between',
  },
  playIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.7)',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  topicCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  topicIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicTitle: {
    textAlign: 'center',
  },
  mythCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Theme.shadows.light,
  },
  mythHeader: {
    marginBottom: 16,
  },
  mythBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  mythBadgeText: {
    color: '#F43F5E',
    fontWeight: 'bold',
    fontSize: 10,
  },
  mythText: {
    fontSize: 16,
  },
  factRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  factBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  factBadgeText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 10,
  },
  factText: {
    color: Theme.colors.textLight,
  },
});
