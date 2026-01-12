import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/shared/Button';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function DisclaimerScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
           <Typography variant="h2">Important Notice</Typography>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={60} color="#C62828" />
          </View>
          
          <Typography variant="h1" style={styles.title}>Clinical Safety Disclaimer</Typography>
          
          <View style={styles.disclaimerContent}>
            <View style={styles.disclaimerItem}>
              <Ionicons name="alert-circle" size={24} color="#C62828" />
              <Typography variant="body" style={styles.disclaimerText}>
                <Typography variant="body" style={{ fontWeight: 'bold' }}>This app does not provide medical diagnoses.</Typography> All health checks are automated based on clinical guidelines and must be verified by a medical professional.
              </Typography>
            </View>

            <View style={styles.disclaimerItem}>
              <Ionicons name="call" size={24} color="#34E875" />
              <Typography variant="body" style={styles.disclaimerText}>
                In case of a <Typography variant="body" style={{ fontWeight: 'bold' }}>medical emergency</Typography>, do not wait for the app to load. Call emergency services or go to the nearest hospital immediately.
              </Typography>
            </View>

            <View style={styles.disclaimerItem}>
              <Ionicons name="lock-closed" size={24} color="#1565C0" />
              <Typography variant="body" style={styles.disclaimerText}>
                Your data is stored securely and processed according to strict privacy standards. We minimize the data we collect to only what is necessary for your care.
              </Typography>
            </View>

            <View style={styles.disclaimerItem}>
              <Ionicons name="bluetooth" size={24} color="#6A1B9A" />
              <Typography variant="body" style={styles.disclaimerText}>
                This app works offline for educational content, but requires an internet connection periodically to sync with the clinical backend for accurate assessments.
              </Typography>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.checkboxRow} 
            activeOpacity={0.7}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={16} color={Theme.colors.white} />}
            </View>
            <Typography variant="body" style={styles.checkboxLabel}>
              I have read and I understand the safety disclaimer and terms of use.
            </Typography>
          </TouchableOpacity>

          <Button 
            title="I Understand & Accept" 
            variant="primary" 
            size="large"
            disabled={!agreed}
            onPress={() => router.replace('/register')}
            containerStyle={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.l,
  },
  header: {
    paddingVertical: Theme.spacing.m,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: Theme.spacing.l,
  },
  scrollView: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xl,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  disclaimerContent: {
    gap: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
  },
  disclaimerItem: {
    flexDirection: 'row',
    gap: Theme.spacing.m,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingTop: Theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: Theme.spacing.l,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: Theme.spacing.m,
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#34E875',
    borderColor: '#34E875',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});
