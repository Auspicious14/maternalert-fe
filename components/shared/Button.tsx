import { cssInterop } from 'nativewind';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'emergency';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle; // NativeWind style injection
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  containerStyle,
  textStyle,
  icon,
  style,
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: Theme.colors.setupBlue };
      case 'emergency': return { backgroundColor: Theme.colors.emergency };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 2, borderColor: Theme.colors.primary };
      default: return { backgroundColor: Theme.colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'emergency': return Theme.colors.white;
      case 'outline': return Theme.colors.primaryDark;
      default: return isDark ? Theme.colors.textOnDark : '#121915';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, styles[size], getVariantStyle(), containerStyle, style]} 
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        <Typography 
          variant="h3" 
          weight="bold" 
          style={[{ color: getTextColor() }, textStyle]}
        >
          {title}
        </Typography>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

cssInterop(Button, {
  className: 'style',
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginLeft: 12,
  },
  small: {
    height: 44,
    paddingHorizontal: 16,
  },
  medium: {
    height: 56,
    paddingHorizontal: 24,
  },
  large: {
    height: 72,
    paddingHorizontal: 32,
  },
});
