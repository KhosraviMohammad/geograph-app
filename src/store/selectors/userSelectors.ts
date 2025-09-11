import { RootState } from '../types.ts'

// User Selectors
export const selectUser = (state: RootState) => state.user

export const selectUserData = (state: RootState) => selectUser(state).user

export const selectUserToken = (state: RootState) => selectUser(state).token

export const selectUserLoading = (state: RootState) => selectUser(state).loading

export const selectIsAuthenticated = (state: RootState) => selectUser(state).isAuthenticated

export const selectUserProfile = (state: RootState) => {
  const user = selectUserData(state)
  return user ? {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  } : null
}