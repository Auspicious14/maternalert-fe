import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Typography } from '../shared/Typography';
import Theme from '../../constants/theme';

interface LoadingProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

export function Loading({ visible = true, message, overlay = false, fullScreen = false }: LoadingProps) {
  if (!visible) return null;

  if (overlay || fullScreen) {
    return (
      <View style={[styles.container, overlay && styles.overlay, fullScreen && styles.fullScreen]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          {message && (
            <Typography variant="body" className="text-white mt-4 text-center">
              {message}
            </Typography>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size="small" color={Theme.colors.primary} />
      {message && (
        <Typography variant="caption" className="text-gray-500 ml-2">
          {message}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.darkBg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
