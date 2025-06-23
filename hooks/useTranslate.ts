
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import english from '@/localization/english';
import french from '@/localization/french';


export function useTranslate(
  language?: 'en' | 'fr'
) {
  const i18n = new I18n({
    en: english,
    fr: french
  });

  const SUPPORTED_LANGUAGES = ['en', 'fr']

  i18n.locale = language ?? getLocales()[0].languageCode ?? 'en';
  i18n.enableFallback = true;
  
  const localize = i18n.t.bind(i18n);

  return {localize, i18n, SUPPORTED_LANGUAGES}
}
