import { 
  SET_USER, 
  SET_TOKEN, 
  LOGIN, 
  LOGOUT 
} from '../types.ts'
import { AUTH_INITIAL_STATE } from '../types.ts'
import { UserAction } from '../actions/userActions.ts'

export const userReducer = (state = AUTH_INITIAL_STATE, action: UserAction) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: (action as any).payload }
    case SET_TOKEN:
      return { ...state, token: (action as any).payload }
    case LOGIN:
      return { 
        ...state, 
        user: (action as any).payload.user, 
        token: (action as any).payload.token,
        isAuthenticated: true,
        loading: false
      }
    case LOGOUT:
      return { 
        ...state, 
        user: null, 
        token: null,
        isAuthenticated: false,
        loading: false
      }
    default:
      return state
  }
}
