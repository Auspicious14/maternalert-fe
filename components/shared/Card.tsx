import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Theme from '../../constants/theme';

interface CardProps extends ViewProps {
  variant?: 'white' | 'routine' | 'urgent' | 'emergency';
  elevation?: 'none' | 'light' | 'medium';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'white', 
  elevation = 'light',
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'routine': return { backgroundColor: Theme.colors.routine };
      case 'urgent': return { backgroundColor: Theme.colors.urgent };
      case 'emergency': return { backgroundColor: Theme.colors.emergency };
      default: return { backgroundColor: Theme.colors.white };
    }
  };

  const getElevationStyle = () => {
    switch (elevation) {
      case 'medium': return Theme.shadows.medium;
      case 'light': return Theme.shadows.light;
      default: return {};
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), getElevationStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.m,
    marginVertical: Theme.spacing.s,
  },
});
