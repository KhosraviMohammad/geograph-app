// Store Configuration
export const STORE_CONFIG = {
  PERSIST_KEY: 'root',
  PERSIST_WHITELIST: ['user', 'theme']
} as const

// Action Type Prefixes
export const ACTION_PREFIXES = {
  APP: 'app'
} as const

// Default Values
export const DEFAULT_VALUES = {
  USER: null,
} as const

// Storage Keys
export const STORAGE_KEYS = {
  THEME_MODE: 'theme-mode',
  THEME_DIRECTION: 'theme-direction',
  USER: 'user',
} as const
