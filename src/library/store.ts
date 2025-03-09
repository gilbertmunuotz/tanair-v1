import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../assets/authSlice";
import { authSlice } from '../api/AuthSlice';
import { orderSlice } from "../api/OrderSlice";
import { userSlice } from "../api/UserSlice";


// Persist configuration for auth slice
const authPersistConfig = {
    key: 'auth',
    storage,
    version: 1,
}

// Combine reducers into a single reducer object.
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer), // Only persist the auth slice
    [authSlice.reducerPath]: authSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
})

//  Export The store
export const Store = configureStore({
    reducer: rootReducer,
    // Add the middleware for the API slices
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            },
        }).concat(authSlice.middleware, orderSlice.middleware, userSlice.middleware),
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch;

// Create and export persistor for the store
export const persistor = persistStore(Store);