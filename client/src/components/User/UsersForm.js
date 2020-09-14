import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form, Field } from 'redux-form'
import { isEmpty } from './../../helpers'

export const UsersForm = ({
  handleSubmit,
  pristine,
  submitting,
  initialValues,
  reset,
  ...props
}) => {
  function handleClickSubmit(values) {
    if (values.edit) {
      const { id, article } = values
      const payload = { id, article }
      props.update(payload)
    } else {
      props.create(values.article)
    }
    reset()
    props.setShow(false)
  }

  function handleClickCancel() {
    props.initialize({})
    props.setShow(false)
  }

  return (
    <Form onSubmit={handleSubmit(handleClickSubmit)}>
      <div>
        <label>First Name</label>
        <div>
          <Field name='firstName' component='input' type='text' placeholder='First Name' />
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field name='lastName' component='input' type='text' placeholder='Last Name' />
        </div>
      </div>
      <div>
        <label>Email</label>
        <div>
          <Field name='email' component='input' type='email' placeholder='Email' />
        </div>
      </div>
      <div>
        <label>Sex</label>
        <div>
          <label>
            <Field name='sex' component='input' type='radio' value='male' /> Male
          </label>
          <label>
            <Field name='sex' component='input' type='radio' value='female' /> Female
          </label>
          <label>
            <Field name='sex' component='input' type='radio' value='other' /> Other
          </label>
        </div>
      </div>
      <div>
        <label>Favorite Color</label>
        <div>
          <Field name='favoriteColor' component='select'>
            <option />
            <option value='ff0000'>Red</option>
            <option value='00ff00'>Green</option>
            <option value='0000ff'>Blue</option>
          </Field>
        </div>
      </div>
      <div>
        <label htmlFor='employed'>Employed</label>
        <div>
          <Field name='employed' id='employed' component='input' type='checkbox' />
        </div>
      </div>
      <div>
        <label>Notes</label>
        <div>
          <Field name='notes' component='textarea' />
        </div>
      </div>
      <div>
        <button type='submit' disabled={pristine || submitting}>
          Submit
        </button>
        <button type='button' disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </Form>
  )
}

const mapStateToProps = state => ({})

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
