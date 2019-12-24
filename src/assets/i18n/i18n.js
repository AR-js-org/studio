import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de_DE from './locales/de-DE/de-DE.js';
import en_US from './locales/en-US/en-US.js';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'de-DE': de_DE,
      'en-US': en_US,
    },

    keySeparator: false,
    nonExplicitWhitelist: true,
    interpolation: {
      escapeValue: false,
    },

    // TODO: consider saveMissing
  });

export default i18next;
