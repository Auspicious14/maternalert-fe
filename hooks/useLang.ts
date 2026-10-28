import { useSyncExternalStore } from "react";

import { getLang, Lang, subscribeLang } from "../services/i18n";

// Same hook as maternalert-web/src/hooks/useLang.ts

/** The current language. Screens that show translated text call this so they redraw when it changes. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, getLang, () => "en" as Lang);
}
