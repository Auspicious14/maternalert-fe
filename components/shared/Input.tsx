import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  containerStyle, 
  error, 
  ...props 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Typography variant="caption" style={styles.label}>{label}</Typography>}
      <View style={[styles.inputContainer, error ? styles.errorBorder : undefined]}>
        <TextInput 
          style={styles.input}
          placeholderTextColor={Theme.colors.inactiveTab}
          {...props}
        />
      </View>
      {error && <Typography variant="caption" color={Theme.colors.emergencyText}>{error}</Typography>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.m,
  },
  label: {
    marginBottom: Theme.spacing.xs,
    marginLeft: Theme.spacing.s,
  },
  inputContainer: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.m,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.baseSize,
    color: Theme.colors.text,
  },
  errorBorder: {
    borderColor: Theme.colors.emergencyText,
  },
});
