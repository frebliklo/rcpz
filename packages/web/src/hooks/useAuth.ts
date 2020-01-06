import { useContext } from 'react'

import { AuthContext } from '../components/AuthState'

export const useAuth = () => useContext(AuthContext)
