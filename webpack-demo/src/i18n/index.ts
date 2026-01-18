import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './en';
import * as zh from './zh';

export const resources = {
    en,
    zh,
};

export function setupI18n() {
    i18next.use(initReactI18next).init({
        fallbackLng: 'zh',
        interpolation: {
            escapeValue: false,
        },
        debug: false,
        // 禁用默认命名空间
        // defaultNS: 'common',
        resources,
    });
}
