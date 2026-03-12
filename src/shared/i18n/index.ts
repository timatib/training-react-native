import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ruCommon from './ru/common.json';
import ruAuth from './ru/auth.json';
import ruChat from './ru/chat.json';
import ruProfile from './ru/profile.json';

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enChat from './en/chat.json';
import enProfile from './en/profile.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      common: ruCommon,
      auth: ruAuth,
      chat: ruChat,
      profile: ruProfile,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      chat: enChat,
      profile: enProfile,
    },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  ns: ['common', 'auth', 'chat', 'profile'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
