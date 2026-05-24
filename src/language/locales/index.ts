import type { Locale } from "../types";
import { en } from "./en";
import { ru } from "./ru";

export const locales = { ru, en } as const;

export function getLocaleData(locale: Locale) {
  return locales[locale] ?? locales.ru;
}
