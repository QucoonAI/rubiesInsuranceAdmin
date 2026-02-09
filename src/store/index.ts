import localforage from "localforage";
import { rootReducer } from "@/store/module";
import { Middleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { middlewareApi, reducerApi } from "@/service/api";
import { setupListeners } from "@reduxjs/toolkit/query";

localforage.config({
    driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE,
    ],
    name: 'rubies-insure-admin',
    version: 1.0,
    storeName: 'rubies-insure-store',
    description: 'Storage for Rubies Insure admin portal',
});

const persistConfig = {
    key: 'root',
    storage: localforage,
    blacklist: Object.keys(reducerApi),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(...(middlewareApi as Middleware[])),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
setupListeners(store.dispatch);
