import React, { createContext, useReducer } from 'react'

import { ACCESS_TOKEN } from '../constants'

export enum AuthActionTypes {
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

interface IAuthState {
  authenticated: boolean
  userId?: string | null
}

interface IAuthAction {
  type: AuthActionTypes
  payload?: {
    userId?: string
    token?: string
  }
}

const initialAuthContext: { authState: IAuthState; setAuthState: React.Dispatch<IAuthAction> } = {
  authState: {
    authenticated: false,
  },
  setAuthState: () => {},
}

export const AuthContext = createContext(initialAuthContext)

export const authReducer = (state: IAuthState, action: IAuthAction) => {
  console.log('Dispatching: ', action.type)
  switch (action.type) {
    case AuthActionTypes.SIGNUP:
      localStorage.setItem(ACCESS_TOKEN, action.payload!.token!)

      return {
        authenticated: true,
        userId: action.payload!.userId!,
      }
    case AuthActionTypes.LOGIN:
      localStorage.setItem(ACCESS_TOKEN, action.payload!.token!)

      return {
        authenticated: true,
        userId: action.payload!.userId!,
      }
    case AuthActionTypes.LOGOUT:
      localStorage.removeItem(ACCESS_TOKEN)

      return {
        authenticated: false,
        userId: null,
      }
    default:
      return state
  }
}

export const initialAuthState: IAuthState = {
  authenticated: false,
  userId: null,
}

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const authState = state
  const setAuthState = dispatch

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
}
