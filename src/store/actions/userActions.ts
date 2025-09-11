import { 
  SET_USER, 
  SET_TOKEN, 
  LOGIN, 
  LOGOUT 
} from '../types.ts'

// Action Types
interface SetUserAction {
  type: typeof SET_USER
  payload: any | null
}

interface SetTokenAction {
  type: typeof SET_TOKEN
  payload: string | null
}

interface LoginAction {
  type: typeof LOGIN
  payload: {
    token: string
    user: any
  }
}

interface LogoutAction {
  type: typeof LOGOUT
  payload?: undefined
}

export type UserAction = SetUserAction | SetTokenAction | LoginAction | LogoutAction

// User Actions
export const setUser = (user: any | null): SetUserAction => ({
  type: SET_USER,
  payload: user
})

export const setToken = (token: string | null): SetTokenAction => ({
  type: SET_TOKEN,
  payload: token
})

export const login = ({token, user}: {token: string, user: any}): LoginAction => ({
  type: LOGIN,
  payload: {token, user}
})

export const logout = (): LogoutAction => ({
  type: LOGOUT
})

export const clearUser = (): SetUserAction => ({
  type: SET_USER,
  payload: null
})

export const updateUserProfile = (updates: any): SetUserAction => ({
  type: SET_USER,
  payload: { ...updates }
})
