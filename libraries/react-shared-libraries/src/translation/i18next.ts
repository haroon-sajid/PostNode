import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, languages, defaultNS } from './i18n.config';
import { getAppName } from '@postnode/helpers/utils/app.name';
const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: any, namespace: any) => {
      // American English uses the same texts as English
      const folder = language === 'en-US' ? fallbackLng : language;
      return import(`./locales/${folder}/${namespace}.json`);
    })
  )
  .init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined,
    fallbackNS: defaultNS,
    defaultNS,
    detection: {
      order: ['cookie', 'header'],
    },
    preload: runsOnServerSide ? languages : [],
    // Lets translations write {{appName}} instead of hardcoding the product name
    interpolation: {
      defaultVariables: { appName: getAppName() },
    },
  });

export default i18next;
