import { RootState, THEMES, DIRECTIONS } from '../types.ts'

// Theme Selectors
export const selectTheme = (state: RootState) => state.theme

export const selectThemeMode = (state: RootState) => selectTheme(state).mode

export const selectThemeDirection = (state: RootState) => selectTheme(state).direction

export const selectIsDarkTheme = (state: RootState) => selectThemeMode(state) === THEMES.DARK

export const selectIsLightTheme = (state: RootState) => selectThemeMode(state) === THEMES.LIGHT

export const selectIsRTL = (state: RootState) => selectThemeDirection(state) === DIRECTIONS.RTL

export const selectIsLTR = (state: RootState) => selectThemeDirection(state) === DIRECTIONS.LTR

export const selectThemeModeString = (state: RootState): string => {
  const mode = selectThemeMode(state)
  return mode === THEMES.DARK ? 'dark' : 'light'
}

export const selectThemeDirectionString = (state: RootState): string => {
  const direction = selectThemeDirection(state)
  return direction === DIRECTIONS.RTL ? 'rtl' : 'ltr'
}
