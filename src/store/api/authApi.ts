import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { authUrls } from '../../utils/urls'
import type { RootState } from '../types'
import { login as loginAction } from '../actions/userActions'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email?: string
  }
  success: boolean
  message?: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state?.user?.token
      headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: authUrls.login(),
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any): LoginResponse => {
        const wrappedData = response?.data?.data ?? response?.data ?? response
        return {
          token: wrappedData?.token,
          user: wrappedData?.user,
          success: response?.success ?? true,
          message: response?.message,
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.token && data?.user) {
            dispatch(loginAction({ token: data.token, user: data.user }) as any)
          }
        } catch (err) {
          // no-op on error; component can handle errors
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi



