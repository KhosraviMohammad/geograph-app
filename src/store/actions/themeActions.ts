import { SET_THEME_MODE, SET_THEME_DIRECTION, ThemeMode, Direction } from '../types.ts'

export interface SetThemeModeAction {
  type: typeof SET_THEME_MODE
  payload: ThemeMode
}

export interface SetThemeDirectionAction {
  type: typeof SET_THEME_DIRECTION
  payload: Direction
}

export type ThemeAction = SetThemeModeAction | SetThemeDirectionAction

export const setThemeMode = (mode: ThemeMode): SetThemeModeAction => ({
  type: SET_THEME_MODE,
  payload: mode
})

export const setThemeDirection = (direction: Direction): SetThemeDirectionAction => ({
  type: SET_THEME_DIRECTION,
  payload: direction
})