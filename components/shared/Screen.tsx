import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import Theme from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  safe?: boolean;
  backgroundColor?: string;
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
    <Container style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ContentContainer 
          style={[styles.flex, style]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        >
          {children}
        </ContentContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
  },
});
