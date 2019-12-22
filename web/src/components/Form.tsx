import React from 'react'
import { useField } from 'formik'

interface FormFieldProps {
  label: string
  name: string
  id: string
  optional?: boolean
}

export const FormField: React.FC<FormFieldProps & React.HTMLProps<HTMLInputElement>> = ({
  label,
  optional = false,
  ...props
}) => {
  // https://github.com/jaredpalmer/formik/issues/1961
  const [field, meta] = useField(props.name)

  return (
    <>
      <label htmlFor={props.id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
        {optional && <span className="text-gray-500 font-normal"> (optional)</span>}
      </label>
      <input
        {...field}
        {...props}
        required={optional ? false : true}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </>
  )
}
