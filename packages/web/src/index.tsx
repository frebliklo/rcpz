import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, Observable } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode from 'jwt-decode'

import App from './App'
import { getAccessToken, setAccessToken } from './accessToken'
import { SERVER_URL, REFRESH_ENDPOINT } from './constants'
import { AuthProvider } from './components/AuthState'
import { IDecodedToken } from './types/AuthToken'

import './styles/tailwind.css'

const cache = new InMemoryCache({})

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any
      Promise.resolve(operation)
        .then(operation => {
          const token = getAccessToken()

          operation.setContext({
            headers: {
              authorization: token ? `Bearer ${token}` : '',
            },
          })
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    }),
)

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: 'accessToken',
      isTokenValidOrUndefined: () => {
        const token = getAccessToken()

        if (!token) return true

        try {
          const { exp }: IDecodedToken = jwtDecode(token)

          if (Date.now() >= exp * 1000) {
            return false
          } else {
            return true
          }
        } catch (error) {
          return false
        }
      },
      fetchAccessToken: () => {
        return fetch(REFRESH_ENDPOINT, {
          credentials: 'include',
          method: 'POST',
        })
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken)
      },
      handleError: err => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin')
        console.error(err)
      },
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors)
      console.log(networkError)
    }),
    requestLink,
    new HttpLink({
      uri: SERVER_URL,
      credentials: 'include',
    }),
  ]),
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
