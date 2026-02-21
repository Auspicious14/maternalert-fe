import { useAppTheme } from "./useAppTheme";

export function useColorScheme() {
  const { colorScheme } = useAppTheme();
  return colorScheme;
}
