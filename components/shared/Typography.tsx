import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import Theme from '../../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold' | '900';
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
  weight,
  color, 
  style, 
  ...props 
}) => {
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
  let { fontWeight, fontFamily: styleFontFamily, ...cleanStyle } = flattenedStyle as any;

  const finalWeight = weight || fontWeight;

  const getWeightStyle = () => {
    if (!finalWeight) return null;
    const w = String(finalWeight);
    if (w === 'bold' || w === '700' || w === '800' || w === '900') {
      return { fontFamily: Theme.typography.fontFamilies.bold };
    }
    if (w === '600' || w === 'semi-bold' || w === 'semiBold') {
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
        { color: color || Theme.colors.text }, 
        cleanStyle
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: Theme.typography.fontFamilies.bold,
    fontSize: Theme.typography.headerSize,
  },
  h2: {
    fontFamily: Theme.typography.fontFamilies.bold,
    fontSize: Theme.typography.subHeaderSize,
  },
  h3: {
    fontFamily: Theme.typography.fontFamilies.medium,
    fontSize: 18,
  },
  body: {
    fontFamily: Theme.typography.fontFamilies.regular,
    fontSize: Theme.typography.baseSize,
    lineHeight: 24,
  },
  caption: {
    fontFamily: Theme.typography.fontFamilies.regular,
    fontSize: 14,
    color: Theme.colors.textLight,
  },
});
