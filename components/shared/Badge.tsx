import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'emergency' | 'white';
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'primary', 
  icon,
  containerStyle 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: Theme.colors.secondary };
      case 'accent': return { backgroundColor: Theme.colors.accent };
      case 'emergency': return { backgroundColor: Theme.colors.emergency };
      case 'white': return { backgroundColor: Theme.colors.white };
      default: return { backgroundColor: Theme.colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'emergency': return Theme.colors.emergencyText;
      default: return Theme.colors.text;
    }
  };

  return (
    <View style={[styles.badge, getVariantStyle(), containerStyle]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography 
        variant="caption" 
        style={[styles.text, { color: getTextColor() }]}
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderRadius: Theme.borderRadius.large,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: Theme.spacing.xs,
  },
  text: {
    fontWeight: Theme.typography.fontWeight.medium as any,
  },
});
