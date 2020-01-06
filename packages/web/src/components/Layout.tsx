import React from 'react'
import { Navigation } from './Navigation'

interface Props {}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </>
  )
}

export const FormLayout: React.FC = ({ children }) => {
  return (
    <div className="flex items-center justify-center bg-blue-200 min-h-screen">
      <main className="w-full max-w-md mx-auto pt-6">{children}</main>
    </div>
  )
}
