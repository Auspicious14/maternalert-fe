/**
 * Languages for patient-facing text.
 * IDENTICAL in maternalert-web (src/services/i18n.ts) and
 * maternalert-fe (services/i18n.ts): plain TypeScript, no imports.
 *
 * Translations sit right next to the English, so a reviewer can check them
 * line by line:   tr({ en: "Get help now", pcm: "Find help now now" })
 * Anything not translated yet falls back to English.
 *
 * Pidgin (pcm) is Nigerian Pidgin; yo is Yorùbá. Medical wording must be
 * checked by a native speaker who is also a health worker before wide release.
 */

export type Lang = "en" | "pcm" | "yo";

export const LANGUAGES: { code: Lang; name: string; native: string; sample: string }[] = [
  { code: "en", name: "English", native: "English", sample: "Your blood pressure looks normal" },
  { code: "pcm", name: "Pidgin", native: "Naija Pidgin", sample: "Your BP dey normal" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", sample: "Ìfúnpá rẹ dára" },
];

export const isLang = (x: unknown): x is Lang => x === "en" || x === "pcm" || x === "yo";

let current: Lang = "en";
const listeners = new Set<() => void>();

export const getLang = (): Lang => current;

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  listeners.forEach((f) => f());
}

export function subscribeLang(f: () => void): () => void {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
}

/** Pick the text for the current language (falls back to English). */
export function tr<T>(m: { en: T; pcm?: T; yo?: T }): T {
  const v = m[current];
  return v === undefined ? m.en : v;
}

/** Fill {name} placeholders. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] === undefined ? `{${k}}` : String(vars[k])));
}

/** Locale for dates and numbers. Pidgin readers use Nigerian English dates. */
export const dateLocale = (): string => (current === "en" ? "en-GB" : "en-NG");
