import React from 'react'
import PropTypes from 'prop-types'

export const TextInput = ({ input, ...props }) => {
  return (
    <div>
      {props.type === 'textarea' ? (
        <textarea id={props.id} {...props} {...input} />
      ) : (
        <input id={props.id} {...props} {...input} />
      )}
    </div>
  )
}

TextInput.propTypes = {
  type: PropTypes.string.isRequired
}

TextInput.defaultProps = {
  type: 'text'
}
