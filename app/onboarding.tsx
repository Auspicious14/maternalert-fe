import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        {/* Language Selector Placeholder */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.languageSelector} activeOpacity={0.7}>
            <Ionicons name="language" size={20} color={Theme.colors.primary} />
            <Typography variant="body" style={styles.languageText}>English</Typography>
            <Ionicons name="chevron-down" size={16} color={Theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.illustrationContent}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544126592-807daa2b569b?q=80&w=400&auto=format&fit=crop' }} 
              style={styles.image} 
              resizeMode="cover"
            />
            {/* Overlay Gradientish thing for fidelity */}
            <View style={styles.imageOverlay} />
          </View>
        </View>

        <View style={styles.textContent}>
          <Typography variant="h1" style={styles.title}>Safe Pregnancy{"\n"}Tracking</Typography>
          <Typography variant="body" style={styles.subtitle}>
            This app helps you notice warning signs early and know when to seek care.
          </Typography>

          <View style={styles.importantBox}>
            <View style={styles.importantIconBg}>
              <Ionicons name="medical" size={20} color="#3B82F6" />
            </View>
            <View style={styles.importantTextContent}>
              <Typography variant="h3" style={styles.importantTitle}>Important</Typography>
              <Typography variant="caption" style={styles.importantSubtitle}>
                This app does not replace a doctor or midwife. Please consult a professional for medical advice.
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueButton} 
            activeOpacity={0.8}
            onPress={() => router.push('/disclaimer')}
          >
            <Typography variant="h2" style={styles.continueText}>Continue</Typography>
            <Ionicons name="arrow-forward" size={24} color="#1A212E" />
          </TouchableOpacity>

          <Typography variant="caption" style={styles.termsText}>
            By continuing, you agree to our <Typography variant="caption" style={styles.link}>Terms of Service</Typography> & <Typography variant="caption" style={styles.link}>Privacy Policy</Typography>
          </Typography>
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
  topHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.m,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    ...Theme.shadows.light,
  },
  languageText: {
    fontWeight: 'bold',
  },
  illustrationContent: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  imageWrapper: {
    width: 320,
    height: 380,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#FEE2E2', // Mockup pink tint
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 155, 62, 0.05)', // Subtle warm tint from mockup
  },
  textContent: {
    paddingHorizontal: Theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    color: Theme.colors.textLight,
    lineHeight: 24,
    fontSize: 18,
    marginBottom: 30,
  },
  importantBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: Theme.spacing.m,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  importantIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantTextContent: {
    flex: 1,
  },
  importantTitle: {
    fontWeight: 'bold',
  },
  importantSubtitle: {
    color: '#4B5563',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    width: '100%',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  continueText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  termsText: {
    color: Theme.colors.textLight,
    textAlign: 'center',
    fontSize: 12,
  },
  link: {
    color: Theme.colors.text,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
