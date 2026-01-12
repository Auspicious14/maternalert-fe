import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import Theme from '../../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
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

  return (
    <Text 
      style={[
        getVariantStyle(), 
        { color: color || Theme.colors.text }, 
        style
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
