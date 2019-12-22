import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import JwtDecode from 'jwt-decode'

import { AuthActionTypes } from './components/AuthState'
import { Home } from './containers/Home'
import { Login } from './containers/Login'
import { Profile } from './containers/Profile'
import { Register } from './containers/Register'
import { REFRESH_ENDPOINT } from './constants'
import { useAuth } from './hooks/useAuth'
import { IRefreshResponse, IDecodedToken } from './types/AuthToken'

const App: React.FC = () => {
  const { setAuthState } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(REFRESH_ENDPOINT, {
      credentials: 'include',
      method: 'POST',
    }).then(async res => {
      const data: IRefreshResponse = await res.json()

      if (data.ok) {
        const { userId }: IDecodedToken = JwtDecode(data.accessToken)
        setAuthState({ type: AuthActionTypes.LOGIN, payload: { token: data.accessToken, userId } })
      }

      setLoading(false)
    })
  }, [setAuthState])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
