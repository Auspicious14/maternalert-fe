import { Redirect } from 'expo-router';

export default function Index() {
  // The InitialRouteHandler in _layout.tsx will handle the actual logic,
  // but we need a default entry point to prevent a blank screen or +not-found.
  return <Redirect href="/onboarding" />;
}
