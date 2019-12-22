import React from 'react'

interface Props {}

export const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 flex items-center justify-between flex-wrap">
      {children}
    </div>
  )
}
