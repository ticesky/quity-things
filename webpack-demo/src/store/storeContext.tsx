import React, { createContext, useContext } from 'react';
import { type RootStore } from '.';

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({
    store,
    children,
}: {
    store: RootStore;
    children: React.ReactNode;
}) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

export const useRootStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useRootStore must be used within StoreProvider');
    }
    return store;
};
