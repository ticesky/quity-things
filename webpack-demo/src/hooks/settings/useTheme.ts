import { useEffect } from 'react';
import { useTheme as useThemeAhooks } from 'ahooks';
import { rootStore } from 'src/store';

/**
 * 深浅主题切换
 */
function useThemeToggleEffect() {
    // 简单兼容低版本浏览器（如safari < 14），保证监听不报错
    // 低版本safari window没有挂载MediaQueryList，这里通过Object获取原型
    const mediaQueryListProto = Object.getPrototypeOf(
        matchMedia('(min-width: 0px)'),
    );
    if (!mediaQueryListProto.addEventListener) {
        mediaQueryListProto.addEventListener = function () {};
        mediaQueryListProto.removeEventListener = function () {};
    }

    const { theme, themeMode, setThemeMode } = useThemeAhooks({
        localStorageKey: 'user-theme',
    });

    // 方便使用CSS来控制不同主题下的样式, 如:
    //     :global(:root[data-theme='dark']) & {
    //         background-color: var(--dark-bg-color);
    //     }
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        rootStore.themeStore.setTheme(theme);
    }, [theme]);

    useEffect(() => {
        rootStore.themeStore.setThemeMode(themeMode);
    }, [themeMode]);

    return {
        setThemeMode,
    };
}

export default useThemeToggleEffect;
