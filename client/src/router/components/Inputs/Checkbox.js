import React from 'react'

export const Checkbox = ({ input, ...props }) => {
  return <input type='checkbox' checked={input.value} {...props} {...input} />
}
