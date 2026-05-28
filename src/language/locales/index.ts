import type { Locale } from "../types";
import { en } from "./en";
import { ru } from "./ru";
import { uk } from "./uk";

export const locales = { ru, en, uk } as const;

export function getLocaleData(locale: Locale) {
  return locales[locale] ?? locales.ru;
}
