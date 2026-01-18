import { useEffect } from 'react';
import { changeLanguage } from 'i18next';

/**
 * 自动切换多语言
 */
export const useLangAutoChange = () => {
    useEffect(() => {
        changeLanguage(getSysLang());
    }, []);
};

function getSysLang() {
    const LANG = {
        zh: 'zh',
        en: 'en',
    };
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? LANG.zh : LANG.en;
}
