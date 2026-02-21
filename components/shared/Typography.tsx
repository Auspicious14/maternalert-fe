import { cssInterop } from 'nativewind';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import Theme, { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold' | '900' | 'black';
  color?: string;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
  weight,
  color, 
  style, 
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1': return styles.h1;
      case 'h2': return styles.h2;
      case 'h3': return styles.h3;
      case 'caption': return styles.caption;
      default: return styles.body;
    }
  };

  const flattenedStyle = StyleSheet.flatten(style) || {};
  
  // Extract and clean up styles to avoid conflicts between fontFamily and fontWeight
  // In React Native, using a specific fontFamily file (like Lexend-Bold) 
  // usually means we shouldn't apply a separate fontWeight or it might fallback to system fonts.
  const { 
    fontWeight: styleFontWeight, 
    fontFamily: styleFontFamily, 
    color: styleColor,
    ...restStyle 
  } = flattenedStyle as any;

  const finalWeight = weight || styleFontWeight;
  const hasInjectedFont = !!styleFontFamily;

  const getWeightStyle = () => {
    if (hasInjectedFont) return { fontFamily: styleFontFamily };
    
    if (!finalWeight) {
      // Fallback to variant's default font if no weight is provided
      const variantDefault = getVariantStyle();
      return { fontFamily: variantDefault.fontFamily };
    }
    
    const w = String(finalWeight).toLowerCase();
    if (w === 'bold' || w === '700' || w === '800' || w === '900' || w === 'black') {
      return { fontFamily: Theme.typography.fontFamilies.bold };
    }
    if (w === '600' || w === 'semi-bold' || w === 'semibold') {
      return { fontFamily: Theme.typography.fontFamilies.semiBold };
    }
    if (w === '500' || w === 'medium') {
      return { fontFamily: Theme.typography.fontFamilies.medium };
    }
    return { fontFamily: Theme.typography.fontFamilies.regular };
  };

  return (
    <Text 
      style={[
        getVariantStyle(), 
        getWeightStyle(),
        { color: color || styleColor || (isDark ? Colors.dark.text : Colors.light.text) }, 
        restStyle // Apply everything BUT the font settings from style to avoid overrides
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

cssInterop(Typography, {
  className: 'style',
});

const styles = StyleSheet.create({
  h1: {
    fontSize: Theme.typography.headerSize,
    fontFamily: Theme.typography.fontFamilies.bold,
  },
  h2: {
    fontSize: Theme.typography.subHeaderSize,
    fontFamily: Theme.typography.fontFamilies.bold,
  },
  h3: {
    fontSize: 18,
    fontFamily: Theme.typography.fontFamilies.medium,
  },
  body: {
    fontSize: Theme.typography.baseSize,
    lineHeight: 24,
    fontFamily: Theme.typography.fontFamilies.regular,
  },
  caption: {
    fontSize: 14,
    color: Theme.colors.textLight,
    fontFamily: Theme.typography.fontFamilies.regular,
  },
});
