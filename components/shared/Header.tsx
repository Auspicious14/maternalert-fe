import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = true, 
  rightElement 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Typography variant="h2" style={styles.title}>{title}</Typography>
      
      <View style={styles.rightContainer}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.m,
    height: 60,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
