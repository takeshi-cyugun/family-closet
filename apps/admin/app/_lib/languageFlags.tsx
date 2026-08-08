import JP from "country-flag-icons/react/3x2/JP";
import US from "country-flag-icons/react/3x2/US";
import CN from "country-flag-icons/react/3x2/CN";
import TW from "country-flag-icons/react/3x2/TW";

export const LANGUAGE_FLAGS: Record<string, typeof JP> = {
  ja: JP,
  en: US,
  "zh-CN": CN,
  "zh-TW": TW,
};

export const LANGUAGE_LABEL: Record<string, string> = {
  ja: "日本語",
  en: "English",
  "zh-CN": "中文（简体）",
  "zh-TW": "中文（繁體）",
};
