import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface StatusBannerProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  icon?: React.ReactNode | keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ 
  message, 
  variant = 'info', 
  icon,
  containerStyle 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success': return { bg: Theme.colors.secondary, text: Theme.colors.routineText, defaultIcon: 'checkmark-circle' as const };
      case 'warning': return { bg: Theme.colors.accent, text: Theme.colors.urgentText, defaultIcon: 'warning' as const };
      case 'error': return { bg: Theme.colors.emergency, text: Theme.colors.emergencyText, defaultIcon: 'alert-circle' as const };
      case 'urgent': return { bg: Theme.colors.urgent, text: Theme.colors.urgentText, defaultIcon: 'alert-circle' as const };
      default: return { bg: Theme.colors.primary, text: Theme.colors.text, defaultIcon: 'information-circle' as const };
    }
  };

  const { bg, text, defaultIcon } = getVariantStyles();

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    return <Ionicons name={(icon as any) || defaultIcon} size={20} color={text} style={styles.icon} />;
  };

  return (
    <View style={[styles.banner, { backgroundColor: bg }, containerStyle]}>
      {renderIcon()}
      <Typography variant="caption" style={{ color: text, fontWeight: 'bold' }}>
        {message.toUpperCase()}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
    borderRadius: Theme.borderRadius.large,
    marginVertical: Theme.spacing.s,
  },
  icon: {
    marginRight: Theme.spacing.s,
  },
});
