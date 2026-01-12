import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'emergency';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  containerStyle,
  textStyle,
  icon,
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: Theme.colors.setupBlue };
      case 'emergency': return { backgroundColor: Theme.colors.emergency };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: Theme.colors.primary };
      default: return { backgroundColor: Theme.colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'emergency': return Theme.colors.white;
      case 'outline': return Theme.colors.text;
      default: return Theme.colors.text;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, styles[size], getVariantStyle(), containerStyle]} 
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginLeft: Theme.spacing.s,
  },
  text: {
    fontFamily: Theme.typography.fontFamily,
    fontWeight: Theme.typography.fontWeight.bold as any,
    fontSize: 16,
  },
  small: {
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
  },
  medium: {
    paddingVertical: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.l,
  },
  large: {
    paddingVertical: Theme.spacing.l,
    paddingHorizontal: Theme.spacing.xl,
  },
});
