import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Formik, FormikHelpers } from 'formik'

import { FormField } from '../components/Form'
import { FormLayout } from '../components/Layout'
import { useSignUpMutation } from '../generated/graphql'
import { useAuth } from '../hooks/useAuth'
import { AuthActionTypes } from '../components/AuthState'

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { setAuthState } = useAuth()
  const [register] = useSignUpMutation()

  const initialValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  }

  const onSubmit = async (
    { email, password, firstName, lastName }: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    setSubmitting(true)

    const response = await register({
      variables: {
        input: {
          email,
          password,
          firstName,
          lastName,
        },
      },
    })

    if (response.data) {
      setAuthState({
        type: AuthActionTypes.SIGNUP,
        payload: {
          userId: response.data.registerWithEmail.user.id,
          token: response.data.registerWithEmail.accessToken,
        },
      })
    }

    setSubmitting(false)
    history.push('/')
  }

  return (
    <FormLayout>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <h1 className="text-2xl font-medium">Create account</h1>
            </div>
            <div className="mb-4">
              <FormField label="Email Address" id="email" name="email" type="email" />
            </div>
            <div className="mb-4">
              <FormField label="Password" id="password" name="password" type="password" />
            </div>
            <div className="mb-4">
              <FormField label="First name" id="firstName" name="firstName" type="text" />
            </div>
            <div className="mb-8">
              <FormField label="Last name" id="lastName" name="lastName" type="text" optional />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <Link
                to="/login"
                className="inline-block align-baseline font-bold text-sm text-blue-700 hover:text-blue-900"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </FormLayout>
  )
}
