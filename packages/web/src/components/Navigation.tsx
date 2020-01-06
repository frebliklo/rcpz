import React from 'react'
import { Link, NavLink, NavLinkProps } from 'react-router-dom'

import { useLogoutMutation } from '../generated/graphql'
import { useAuth } from '../hooks/useAuth'
import { AuthActionTypes } from './AuthState'
import { Container } from './styled/Container'

const baseStyle =
  'block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2 px-2 lg:px-4 rounded'

const NavigationLink: React.FC<NavLinkProps> = ({ children, ...props }) => (
  <NavLink
    className={`${baseStyle} hover:bg-blue-900`}
    activeClassName="text-white bg-blue-800"
    {...props}
  >
    {children}
  </NavLink>
)

interface Props {}

export const Navigation: React.FC<Props> = () => {
  const { authState, setAuthState } = useAuth()
  const [logout, { client }] = useLogoutMutation()

  return (
    <nav className="flex items-center justify-center flex-wrap bg-blue-700 p-6">
      <Container>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link
            to="/"
            className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4 py-2"
          >
            Recipes
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-blue-100 border-blue-400 hover:text-white hover:border-white">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:justify-end lg:w-auto">
          <div className="text-sm">
            {authState.authenticated && <NavigationLink to="/profile">Profile</NavigationLink>}
            {authState.authenticated ? (
              <button
                className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
                onClick={async () => {
                  await logout()
                  setAuthState({ type: AuthActionTypes.LOGOUT })
                  await client!.resetStore()
                }}
              >
                Sign out
              </button>
            ) : (
              <NavigationLink to="/login">Sign in</NavigationLink>
            )}
          </div>
        </div>
      </Container>
    </nav>
  )
}
