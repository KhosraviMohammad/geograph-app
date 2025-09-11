
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { STORE_CONFIG } from './constants.ts'

// Import individual reducers
import { userReducer, themeReducer } from './reducers/index.ts'
// Import RTK Query API
import { authApi } from './api/authApi'

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  [authApi.reducerPath]: authApi.reducer,
})

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
const isSSR = import.meta.env.MODE === 'ssr'
const shouldDisablePersistence = import.meta.env.VITE_DISABLE_REDUX_PERSIST === 'true'

// Only import redux-persist if we're in browser and not in SSR mode
let store: any, persistor: any

try {
  if (isBrowser && !isSSR && !shouldDisablePersistence) {
    // Browser environment: use redux-persist
    const { persistStore, persistReducer }: any = await import('redux-persist')
    const { default: storage }: any = await import('redux-persist/lib/storage')

    const persistConfig: any = {
      key: STORE_CONFIG.PERSIST_KEY,
      storage: storage,
      whitelist: STORE_CONFIG.PERSIST_WHITELIST,
    }
    
    const persistedReducer: any = persistReducer(persistConfig, rootReducer)
    
    store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
          }
        }).concat(authApi.middleware)
    })
    
    persistor = persistStore(store, null, () => {
      console.log('Redux store rehydration completed')
    })
  } else {
    // SSR or persistence disabled: use regular store
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        }).concat(authApi.middleware)
    })
    
    persistor = null
  }
} catch (error) {
  console.warn('Failed to setup redux-persist, using regular store:', error)
  
  // Fallback to regular store if redux-persist fails
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      }).concat(authApi.middleware)
  })
  
  persistor = null
}

export { store, persistor }
export type AppDispatch = typeof store.dispatch
