import { ThemeStore } from './theme';

export class RootStore {
    themeStore: ThemeStore;

    constructor() {
        this.themeStore = new ThemeStore();
    }
}

export const rootStore = new RootStore();

export * from './storeContext';
