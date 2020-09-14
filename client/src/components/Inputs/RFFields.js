import React from 'react'
import { Field } from 'redux-form'

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

// CONNECTED INPUT COMPONENTS
// TODO: Tags, TagsInput
const withRF = compose(useWrapperRF, InputWrapper)

export const RFInput = withRF(Input)
export const RFRadio = withRF(Radio)
export const RFSelect = withRF(Select)
export const RFSelectAsync = withRF(SelectAsync)
export const RFCheckbox = useWrapperRF(CheckboxWrapper(Checkbox))
export const RFUploader = withRF(Uploader)
export const RFHTMLEditor = withRF(HTMLEditor)
