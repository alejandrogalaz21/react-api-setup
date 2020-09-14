import React from 'react'
import { Field } from 'redux-form'
import { RadioInput } from './RadioInput'
import { TextInput } from './TextInput'
import { Select, SelectAsync } from './Select'
import { Checkbox } from './Checkbox'
import { HtmlEditor } from './HtmlEditor'
import { compose } from 'redux'

// WRAPPERS
export const InputWrapper = Input => ({ meta, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id}>
        <strong>{props.label}</strong>
      </label>
      <Input {...props} />
      {meta.touched &&
        ((meta.error && <span className='text-danger'>{meta.error}</span>) ||
          (meta.warning && <span className='text-warning'>{meta.warning}</span>))}
      <br />
    </div>
  )
}

export const CheckboxWrapper = Input => ({ meta, ...props }) => {
  return (
    <div>
      <Input {...props} />
      <label htmlFor={props.id}>
        <strong>{props.label}</strong>
      </label>
      {meta.touched &&
        ((meta.error && <span className='text-danger'>{meta.error}</span>) ||
          (meta.warning && <span className='text-warning'>{meta.warning}</span>))}
      <br />
    </div>
  )
}

// Wrapper to connect with Redux Form
export const useWrapperRF = Input => props => {
  return <Field {...props} component={Input} />
}

const withRF = compose(useWrapperRF, InputWrapper)

export const RFInput = withRF(TextInput)
export const RFRadio = withRF(RadioInput)
export const RFSelect = withRF(Select)
export const RFSelectAsync = withRF(SelectAsync)
export const RFCheckbox = useWrapperRF(CheckboxWrapper(Checkbox))
export const RFHtmlEditor = withRF(HtmlEditor)
