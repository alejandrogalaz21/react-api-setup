import React, { useState, useEffect } from 'react'
import { default as ReactSelect } from 'react-select'
import PropTypes from 'prop-types'
import axios from 'axios'

// Select (Native), requires options and formatter function
export const Select = ({ input, ...props }) => {
  const options =
    typeof props.formatter === 'function' ? props.options.map(props.formatter) : props.options

  return (
    <select {...props} {...input}>
      <option value=''>All</option>
      {options.map(item => (
        <option key={item.value} value={item.value} selected={item.value === input.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}

// Multiselect, requires options and can have a formatter function
export const Multiselect = ({ input, ...props }) => {
  const options =
    typeof props.formatter === 'function' ? props.options.map(props.formatter) : props.options

  return (
    <ReactSelect
      {...props}
      {...input}
      onBlur={() => input.onBlur(input.value)}
      options={options}
    />
  )
}

// Asynchronous select, caution with re-render
export const SelectAsync = props => {
  const [options, setOptions] = useState([])
  useEffect(() => {
    axios
      .get(props.url)
      .then(result => result.data.map(props.formattter))
      .then(setOptions)
      .catch(console.log)
  }, [props.formattter, props.url])

  return <Select {...props} options={options} />
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
}

Select.defaultProps = {
  options: []
}
