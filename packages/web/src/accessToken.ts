import { ACCESS_TOKEN } from './constants'

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN)
}

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN, token)
}

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN)
}
