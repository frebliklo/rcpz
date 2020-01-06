import React from 'react'
import { Layout } from '../components/Layout'
import { useMeQuery } from '../generated/graphql'
import { RouteComponentProps } from 'react-router-dom'

interface Props {}

export const Profile: React.FC<Props & RouteComponentProps> = () => {
  const { data, loading, error } = useMeQuery()

  if (error) {
    console.log(error)
    return <div>Something went wrong</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <h1>Profile</h1>
      <h2>{data?.me.firstName}</h2>
      <ul>
        {data?.me.todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </Layout>
  )
}
