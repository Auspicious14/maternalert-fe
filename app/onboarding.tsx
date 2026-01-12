import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.languageSelector} activeOpacity={0.7}>
              <Ionicons name="language" size={20} color={Theme.colors.primary} />
              <Typography variant="body" weight="bold" style={styles.languageText}>English</Typography>
              <Ionicons name="chevron-down" size={16} color={Theme.colors.textLight} />
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.imageCard}>
              <Image 
                source={require('../assets/images/maternal_onboarding_illustration.png')} 
                style={styles.image} 
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Typography variant="h1" weight="bold" style={styles.title}>Safe Pregnancy{"\n"}Tracking</Typography>
            <Typography variant="body" style={styles.subtitle}>
              This app helps you notice warning signs early and know when to seek care.
            </Typography>

            <View style={styles.importantBox}>
              <View style={styles.importantIconCircle}>
                <Ionicons name="medical" size={24} color="#3B82F6" />
              </View>
              <View style={styles.importantTextContent}>
                <Typography variant="h3" weight="bold" style={styles.importantTitle}>Important</Typography>
                <Typography variant="caption" style={styles.importantSubtitle}>
                  This app does not replace a doctor or midwife. Please consult a professional for medical advice.
                </Typography>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/disclaimer')}
            >
              <Typography variant="h2" weight="bold" style={styles.continueText}>Continue</Typography>
              <Ionicons name="arrow-forward" size={24} color="#121915" />
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Typography variant="body" color={Theme.colors.textLight}>Already have an account? </Typography>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Typography variant="body" weight="bold" style={styles.footerLink}>Sign In</Typography>
              </TouchableOpacity>
            </View>

            <Typography variant="caption" style={styles.termsText}>
              By continuing, you agree to our <Typography variant="caption" weight="bold" style={styles.link}>Terms of Service</Typography> & <Typography variant="caption" weight="bold" style={styles.link}>Privacy Policy</Typography>
            </Typography>
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
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: height < 700 ? 10 : 20,
  },
  topHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.s,
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
    color: Theme.colors.text,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height < 700 ? 10 : 20,
  },
  imageCard: {
    width: '90%',
    aspectRatio: 1.2,
    // borderRadius: 40,
    // backgroundColor: '#FFFFFF',
    // ...Theme.shadows.medium,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
    // aspectRatio: 1.2,
  },
  textContent: {
    paddingHorizontal: Theme.spacing.xl,
    marginTop: height < 700 ? 15 : 30,
  },
  title: {
    fontSize: height < 700 ? 28 : 34,
    textAlign: 'center',
    lineHeight: height < 700 ? 36 : 42,
    marginBottom: 10,
    color: '#121915',
  },
  subtitle: {
    textAlign: 'center',
    color: Theme.colors.textLight,
    lineHeight: 22,
    fontSize: 16,
    marginBottom: height < 700 ? 15 : 25,
  },
  importantBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF5FF', // Light blue tint
    padding: Theme.spacing.m,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  importantIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.light,
  },
  importantTextContent: {
    flex: 1,
  },
  importantTitle: {
    fontSize: 16,
    color: '#1E40AF',
  },
  importantSubtitle: {
    color: '#1E40AF',
    lineHeight: 18,
    fontSize: 12,
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    alignItems: 'center',
    marginTop: height < 700 ? 10 : 20,
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    ...Theme.shadows.medium,
  },
  continueText: {
    fontSize: 20,
    color: '#121915',
  },
  loginRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  footerLink: {
    color: Theme.colors.primaryDark,
  },
  termsText: {
    color: Theme.colors.textLight,
    textAlign: 'center',
    fontSize: 12,
  },
  link: {
    color: Theme.colors.text,
    textDecorationLine: 'underline',
  },
});
