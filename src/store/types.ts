import { ACTION_PREFIXES, DEFAULT_VALUES } from './constants.ts'

// Action Types
export const SET_USER = `${ACTION_PREFIXES.APP}/setUser`
export const SET_TOKEN = `${ACTION_PREFIXES.APP}/setToken`
export const LOGIN = `${ACTION_PREFIXES.APP}/login`
export const LOGOUT = `${ACTION_PREFIXES.APP}/logout`
export const SET_THEME_MODE = `${ACTION_PREFIXES.APP}/setThemeMode`
export const SET_THEME_DIRECTION = `${ACTION_PREFIXES.APP}/setThemeDirection`

// State Types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const

export const DIRECTIONS = {
  LTR: 'ltr',
  RTL: 'rtl'
} as const

// Type definitions
export type ThemeMode = typeof THEMES[keyof typeof THEMES]
export type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS]

// User Type
export const USER_INITIAL_STATE = DEFAULT_VALUES.USER

// Auth Type
export const AUTH_INITIAL_STATE = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false
} as const

// Theme Type
export const THEME_INITIAL_STATE = {
  mode: THEMES.LIGHT,
  direction: DIRECTIONS.LTR
} as const

// Root State Type
export interface RootState {
  user: {
    user: any | null
    token: string | null
    loading: boolean
    isAuthenticated: boolean
  }
  theme: {
    mode: ThemeMode
    direction: Direction
  }
}
