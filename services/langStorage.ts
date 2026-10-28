import * as SecureStore from "expo-secure-store";

import { isLang, Lang, setLang } from "./i18n";

// App storage for the chosen language (maternalert-web/src/services/langStorage.ts uses localStorage).

const KEY = "maternalert.lang";

export async function loadLang(): Promise<void> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    if (isLang(v)) setLang(v);
  } catch {
    // stay in English
  }
}

export async function chooseLang(lang: Lang): Promise<void> {
  setLang(lang);
  try {
    await SecureStore.setItemAsync(KEY, lang);
  } catch {
    // ignore
  }
}
