import { Ionicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface StatusBannerProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  icon?: React.ReactNode | keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  style?: ViewStyle; // NativeWind style injection
  className?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ 
  message, 
  variant = 'info', 
  icon,
  containerStyle,
  style,
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
    return (
      <View className="mr-2 items-center justify-center">
        {React.isValidElement(icon) ? (
          icon
        ) : (
          <Ionicons name={(icon as any) || defaultIcon} size={20} color={text} />
        )}
      </View>
    );
  };

  return (
    <View 
      className="flex-row items-center justify-center py-2 px-4 rounded-xl my-2"
      style={[{ backgroundColor: bg }, containerStyle, style]}
    >
      {renderIcon()}
      <Typography variant="caption" weight="bold" style={{ color: text }}>
        {message.toUpperCase()}
      </Typography>
    </View>
  );
};

cssInterop(StatusBanner, {
  className: 'style',
});
