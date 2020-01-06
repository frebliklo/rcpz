export interface IDecodedToken {
  userId: string
  iat: number
  exp: number
}

export interface IRefreshResponse {
  ok: boolean
  accessToken: string
}
