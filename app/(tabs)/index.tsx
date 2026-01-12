import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';

import { useCarePriority } from '../../hooks/useCarePriority';
import { useHealthData } from '../../hooks/useHealthData';

export default function HomeScreen() {
  const router = useRouter();
  const { data: priorityData, isLoading: isLoadingPriority } = useCarePriority();
  const { latestBP, recentSymptoms } = useHealthData();

  // Memoize status colors based on priority
  const statusColors = React.useMemo(() => {
    switch (priorityData?.priority) {
      case 'EMERGENCY': return Theme.colors.redGradient;
      case 'URGENT_REVIEW': return Theme.colors.orangeGradient;
      case 'INCREASED_MONITORING': return Theme.colors.greenGradient;
      default: return Theme.colors.greenGradient;
    }
  }, [priorityData?.priority]);

  const statusLabel = React.useMemo(() => {
    switch (priorityData?.priority) {
      case 'EMERGENCY': return 'EMERGENCY';
      case 'URGENT_REVIEW': return 'ATTENTION NEEDED';
      case 'INCREASED_MONITORING': return 'INCREASED MONITORING';
      default: return 'ROUTINE CARE';
    }
  }, [priorityData?.priority]);

  return (
    <Screen style={styles.container} scrollable backgroundColor={Theme.colors.darkBg}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color={Theme.colors.white} />
        </TouchableOpacity>
        <Typography variant="h2" style={styles.headerTitle}>Priority Dashboard</Typography>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color={Theme.colors.white} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileAvatar}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }} 
              style={styles.avatarImage} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Urgent Status Card */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push(priorityData?.priority === 'EMERGENCY' ? '/emergency' : '/symptom-results')}
        >
          <LinearGradient
            colors={(statusColors as any) || Theme.colors.greenGradient as any}
            style={styles.statusCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statusBadge}>
              <Ionicons 
                name={priorityData?.priority === 'EMERGENCY' || priorityData?.priority === 'URGENT_REVIEW' ? 'alert-circle' : 'checkmark-circle'} 
                size={18} 
                color={Theme.colors.darkBg} 
              />
              <Typography variant="caption" style={styles.statusBadgeText}>{statusLabel}</Typography>
            </View>
            <Typography variant="h1" style={styles.statusTitle}>
              {priorityData?.message || 'Fetching your health status...'}
            </Typography>
            {priorityData?.reasons && priorityData.reasons.length > 0 && (
              <Typography variant="body" style={styles.statusDescription}>
                Based on: {priorityData.reasons.join(', ')}
              </Typography>
            )}
            
            <View style={styles.statusImagePlaceholder}>
               <LinearGradient 
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']} 
                style={styles.innerGradient}
               />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Row */}
        <Card style={styles.statCard}>
          <View style={styles.statInfo}>
             <Typography variant="caption" style={styles.statLabel}>Last BP Reading</Typography>
             <View style={styles.statValueRow}>
                <Typography variant="h1" style={styles.statNumber}>
                  {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : '--/--'}
                </Typography>
                <Typography variant="body" style={styles.statSubText}>
                  {latestBP?.systolic && latestBP.systolic > 140 ? 'High' : 'Normal'}
                </Typography>
             </View>
             <Typography variant="caption" style={styles.statTime}>
               {latestBP?.timestamp ? new Date(latestBP.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No readings yet'}
             </Typography>
          </View>
          <View style={styles.statIconContainer}>
             <Ionicons name="pulse" size={24} color={Theme.colors.accent} />
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.primaryActionButton} 
            onPress={() => router.push('/bp-entry')}
          >
            <Ionicons name="add" size={20} color={Theme.colors.darkBg} />
            <Typography variant="h3" style={styles.actionButtonText}>Add BP</Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryActionButton}
            onPress={() => router.push('/symptom-checker')}
          >
            <Ionicons name="list" size={18} color={Theme.colors.accent} />
            <Typography variant="h3" style={styles.secondaryActionText}>Log Symptoms</Typography>
          </TouchableOpacity>
        </View>

        {/* Unwell Banner */}
        <TouchableOpacity style={styles.unwellBanner} onPress={() => router.push('/emergency')}>
          <View style={styles.unwellIcon}>
            <Ionicons name="medical" size={20} color={Theme.colors.white} />
          </View>
          <View style={styles.unwellContent}>
            <Typography variant="h3" style={styles.unwellTitle}>Feeling unwell?</Typography>
            <Typography variant="caption" style={styles.unwellSubtitle}>Tap for immediate help</Typography>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Theme.colors.emergency} />
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Typography variant="h2" style={styles.sectionTitle}>Recent Activity</Typography>
          <TouchableOpacity>
             <Typography variant="body" style={styles.viewAll}>View all</Typography>
          </TouchableOpacity>
        </View>

        {(recentSymptoms?.length || 0) > 0 ? recentSymptoms?.map((symptom) => (
          <Card key={symptom.id} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#4C2456' }]}>
              <Ionicons name="alert-circle" size={20} color="#E879F9" />
            </View>
            <View style={styles.activityInfo}>
              <Typography variant="h3" style={styles.activityTitle}>{symptom.symptomType.replace(/_/g, ' ')}</Typography>
              <Typography variant="caption" style={styles.activitySubtitle}>Reported</Typography>
            </View>
            <Typography variant="caption" style={styles.activityTime}>
              {new Date(symptom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Card>
        )) : (
          <Typography variant="body" style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20 }}>
            No recent activity recorded
          </Typography>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.spacing.l,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.l,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.l,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Theme.colors.white,
    fontSize: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.m,
  },
  iconButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.accent,
    borderWidth: 2,
    borderColor: Theme.colors.darkBg,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  statusCard: {
    borderRadius: 28,
    padding: Theme.spacing.l,
    marginBottom: Theme.spacing.l,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Theme.spacing.m,
  },
  statusBadgeText: {
    color: Theme.colors.darkBg,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  statusTitle: {
    color: Theme.colors.darkBg,
    lineHeight: 32,
    marginBottom: Theme.spacing.s,
    fontWeight: '900',
  },
  statusDescription: {
    color: 'rgba(26, 21, 18, 0.8)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Theme.spacing.l,
  },
  statusImagePlaceholder: {
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    overflow: 'hidden',
  },
  innerGradient: {
    flex: 1,
  },
  statCard: {
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: Theme.spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.l,
    borderRadius: 24,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Theme.spacing.xs,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 4,
  },
  statNumber: {
    color: Theme.colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  statSubText: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  statTime: {
    color: 'rgba(255,255,255,0.3)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,155,62,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'column',
    gap: Theme.spacing.s,
    marginBottom: Theme.spacing.l,
  },
  primaryActionButton: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: Theme.colors.darkBg,
    fontWeight: 'bold',
  },
  secondaryActionButton: {
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    backgroundColor: 'transparent',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryActionText: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  unwellBanner: {
    backgroundColor: Theme.colors.cardDark,
    padding: Theme.spacing.m,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,75,75,0.2)',
  },
  unwellIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  unwellContent: {
    flex: 1,
  },
  unwellTitle: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  unwellSubtitle: {
    color: 'rgba(255,255,255,0.5)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  sectionTitle: {
    color: Theme.colors.white,
    fontSize: 18,
  },
  viewAll: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: Theme.colors.cardDark,
    borderColor: Theme.colors.borderDark,
    borderWidth: 1,
    padding: Theme.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
    borderRadius: 20,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.m,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: Theme.colors.white,
    fontSize: 15,
  },
  activitySubtitle: {
    color: 'rgba(255,255,255,0.4)',
  },
  activityTime: {
    color: 'rgba(255,255,255,0.3)',
  },
});
