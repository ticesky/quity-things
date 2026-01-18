import { useTheme as useThemeAhooks } from 'ahooks';
import { makeAutoObservable } from 'mobx';

type Theme = ReturnType<typeof useThemeAhooks>['theme'];
type ThemeMode = ReturnType<typeof useThemeAhooks>['themeMode'];
export class ThemeStore {
    constructor() {
        makeAutoObservable(this);
    }

    theme: Theme = 'light';

    themeMode: ThemeMode = 'system';

    get isDark() {
        return this.theme === 'dark';
    }

    setTheme(theme: Theme) {
        this.theme = theme;
    }

    setThemeMode(themeMode: ThemeMode) {
        this.themeMode = themeMode;
    }
}
