import { cssInterop } from 'nativewind';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

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
  backgroundColor,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const resolvedBackground =
    backgroundColor !== undefined
      ? backgroundColor
      : isDark
      ? Theme.colors.darkBg
      : Theme.colors.background;

  const barStyle = isDark ? 'light-content' : 'dark-content';

  const Container: any = safe ? SafeAreaView : View;
  const ContentContainer: any = scrollable ? ScrollView : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: resolvedBackground }, style]}
      edges={safe ? ['top', 'bottom', 'left', 'right'] : []}
    >
      <StatusBar barStyle={barStyle} backgroundColor={resolvedBackground} />
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
