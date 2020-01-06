import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Formik, FormikHelpers } from 'formik'

import { AuthActionTypes } from '../components/AuthState'
import { FormField } from '../components/Form'
import { FormLayout } from '../components/Layout'
import { useSignInMutation } from '../generated/graphql'
import { useAuth } from '../hooks/useAuth'

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setAuthState } = useAuth()
  const [login] = useSignInMutation()

  const initialValues = {
    email: '',
    password: '',
  }

  const onSubmit = async (
    { email, password }: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    setSubmitting(true)

    const response = await login({
      variables: {
        input: {
          email,
          password,
        },
      },
    })

    if (response?.data) {
      setAuthState({
        type: AuthActionTypes.LOGIN,
        payload: {
          userId: response.data.signInWithEmail.user.id,
          token: response.data.signInWithEmail.accessToken,
        },
      })
    }

    setSubmitting(false)
    history.push('/profile')
  }

  return (
    <FormLayout>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <h1 className="text-2xl font-medium">Sign in</h1>
            </div>
            <div className="mb-4">
              <FormField label="Email Address" id="email" name="email" type="email" />
            </div>
            <div className="mb-10">
              <FormField label="Password" id="password" name="password" type="password" />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <Link
                to="/register"
                className="inline-block align-baseline font-bold text-sm text-blue-700 hover:text-blue-900"
              >
                Don't have an account?
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </FormLayout>
  )
}
