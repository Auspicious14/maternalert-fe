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
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.headerSize,
    fontWeight: Theme.typography.fontWeight.bold as any,
  },
  h2: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.subHeaderSize,
    fontWeight: Theme.typography.fontWeight.bold as any,
  },
  h3: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: Theme.typography.fontWeight.medium as any,
  },
  body: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.baseSize,
    fontWeight: Theme.typography.fontWeight.regular as any,
    lineHeight: 24,
  },
  caption: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: Theme.typography.fontWeight.regular as any,
    color: Theme.colors.textLight,
  },
});
