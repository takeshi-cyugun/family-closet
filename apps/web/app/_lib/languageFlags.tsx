import JP from "country-flag-icons/react/3x2/JP";
import US from "country-flag-icons/react/3x2/US";
import CN from "country-flag-icons/react/3x2/CN";
import TW from "country-flag-icons/react/3x2/TW";
import type { LanguageCode } from "./i18n";

export const LANGUAGE_FLAGS: Record<LanguageCode, typeof JP> = {
  ja: JP,
  en: US,
  "zh-CN": CN,
  "zh-TW": TW,
};
