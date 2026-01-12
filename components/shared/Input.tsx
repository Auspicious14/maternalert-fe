import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  className?: string; // For NativeWind
  style?: StyleProp<ViewStyle>; // NativeWind style injection
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  containerStyle, 
  error, 
  style, 
  onFocus,
  onBlur,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {label && (
        <Typography 
          variant="caption" 
          weight="bold" 
          style={[styles.label, isFocused && { color: Theme.colors.primary }]}
        >
          {label}
        </Typography>
      )}
      <View 
        style={[
          styles.inputContainer, 
          isFocused && styles.focusedBorder,
          error ? styles.errorBorder : undefined
        ]}
      >
        <TextInput 
          style={styles.input}
          placeholderTextColor="#94A3B8"
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      {error && (
        <Typography 
          variant="caption" 
          weight="medium"
          style={styles.errorText}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

cssInterop(Input, {
  className: 'style',
});

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  inputContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  focusedBorder: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#F8FEFA',
  },
  input: {
    flex: 1,
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    color: Theme.colors.text,
    paddingVertical: 0,
  },
  errorBorder: {
    borderColor: Theme.colors.emergency,
  },
  errorText: {
    color: Theme.colors.emergency,
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
  },
});
