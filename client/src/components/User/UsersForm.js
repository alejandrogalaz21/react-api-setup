import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form } from 'redux-form'

import { isEmpty } from './../../helpers'

function UsersForm({ handleSubmit, pristine, submitting, initialValues, reset, ...props }) {
  function handleClickSubmit(values) {
    if (!isEmpty(initialValues)) {
      console.log('update')
    } else {
      console.log('create')
    }
    reset()
  }

  function handleClickCancel() {
    props.initialize({})
  }

  return (
    <Form onSubmit={handleSubmit(handleClickSubmit)}>
      <div>
        <label htmlFor='name'>name :</label>
        <input name='name' type='text' />
      </div>
      <button type='submit' disabled={pristine || submitting}>
        {isEmpty(initialValues) ? 'Submit' : 'Update'}
      </button>

      <button type='button' disabled={pristine || submitting} onClick={reset}>
        Undo Changes
      </button>

      <button type='button' onClick={handleClickCancel}>
        Cancel
      </button>
    </Form>
  )
}

const mapStateToProps = state => {
  return {
    initialValues: {}
  }
}
const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'users',
    enableReinitialize: true
  })(UsersForm)
)
