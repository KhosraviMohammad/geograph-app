import { SET_THEME_MODE, SET_THEME_DIRECTION, THEME_INITIAL_STATE } from '../types.ts'
import { ThemeAction } from '../actions/themeActions.ts'

export const themeReducer = (state = THEME_INITIAL_STATE, action: ThemeAction) => {
  switch (action.type) {
    case SET_THEME_MODE:
      return { ...state, mode: action.payload }
    case SET_THEME_DIRECTION:
      return { ...state, direction: action.payload }
    default:
      return state
  }
}
