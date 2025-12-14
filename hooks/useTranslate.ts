
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import english from '@/localization/english';
import french from '@/localization/french';
import { useUser } from '@/providers/UserProvider';

export function useTranslate() {
  const i18n = new I18n({
    en: english,
    fr: french
  });
  const { user } = useUser();
  const  language = user?.language;
  const SUPPORTED_LANGUAGES = ['en', 'fr'];

  const languageCode = getLocales()[0].languageCode;
  i18n.locale = language ?? languageCode ?? 'en';
  i18n.enableFallback = true;
  
  const localize = i18n.t.bind(i18n);
  return {localize, i18n, languageCode, SUPPORTED_LANGUAGES}
}
