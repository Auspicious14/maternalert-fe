import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Theme from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  containerStyle?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = Theme.colors.primary, 
  containerStyle 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${Math.min(100, progress * 100)}%`,
            backgroundColor: color 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: Theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
