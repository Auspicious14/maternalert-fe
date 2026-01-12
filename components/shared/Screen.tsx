import { cssInterop } from 'nativewind';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  safe?: boolean;
  backgroundColor?: string;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({ 
  children, 
  style, 
  scrollable = false, 
  safe = true,
  backgroundColor = Theme.colors.background
}) => {
  const Container = safe ? SafeAreaView : View;
  const ContentContainer = scrollable ? ScrollView : View;

  return (
    <Container style={[styles.container, { backgroundColor }, style]} edges={safe ? ['top', 'bottom', 'left', 'right'] : []}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ContentContainer 
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollable ? styles.scrollContent : { flex: 1 }}
        >
          {children}
        </ContentContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

cssInterop(Screen, {
  className: 'style',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Theme.spacing.xl,
  },
});
