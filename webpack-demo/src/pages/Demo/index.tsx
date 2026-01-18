import { useState } from 'react';
import i18n, { changeLanguage } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useRootStore } from 'src/store';
import { useThemeToggleEffect } from 'src/hooks';
import styles from './index.module.scss';

function Demo() {
    const { themeStore } = useRootStore();
    const { setThemeMode } = useThemeToggleEffect();
    const [count, setCount] = useState<number>(0);
    const { language } = i18n;
    const { t } = useTranslation('layout', { keyPrefix: 'home' });

    async function handleClick() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setCount((pre) => pre + 1);
    }

    function toggleTheme() {
        if (themeStore.isDark) {
            setThemeMode('light');
        } else {
            setThemeMode('dark');
        }
    }

    function toggleLang() {
        changeLanguage(language === 'zh' ? 'en' : 'zh');
    }

    return (
        <div
            className={styles.bg}
            style={{ textAlign: 'center', marginTop: '50px' }}
        >
            <h1>
                {t('title', {
                    prefix: 'React + TS + Webpack + Babel',
                    suffix: '✔️',
                })}
            </h1>
            <div className={styles.btns}>
                <button onClick={handleClick}>
                    {t('count', {
                        count,
                    })}
                </button>
                <button onClick={toggleTheme}>{t('toggleTheme')}</button>
                <button onClick={toggleLang}>{t('toggleLang')}</button>
            </div>
        </div>
    );
}

export default Demo;
