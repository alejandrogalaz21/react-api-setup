import React from 'react'
import PropTypes from 'prop-types'

export const RadioInput = ({ options, input }) => {
  return options.map(option => (
    <div key={option.id}>
      <input
        id={option.id}
        {...input}
        type='radio'
        value={option.value}
        checked={option.value === input.value}
      />
      <label htmlFor={option.id}> {option.label}</label>
    </div>
  ))
}

RadioInput.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
}
