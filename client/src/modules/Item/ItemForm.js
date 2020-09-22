import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form } from 'redux-form'
import { RFInput } from './../../components/Inputs/RFFields'
import { itemCreateRequest, itemUpdateRequest } from './item.redux'
import { isEmpty } from './../../helpers'

export const ItemForm = ({ handleSubmit, pristine, submitting, reset, ...props }) => {
  function handleOnSubmit(values) {
    if (!isEmpty(props.initialValues)) {
      console.log('Update values')
      props.update(values)
    } else {
      props.create(values)
      reset()
    }
  }

  return (
    <div className='row'>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <RFInput name='name' type='text' label='Nombre' />

        <div>
          <button className='btn' type='submit' disabled={submitting}>
            Enviar
          </button>
          <button
            className='btn'
            type='button'
            disabled={pristine || submitting}
            onClick={reset}>
            Reestablecer valores
          </button>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = state => ({
  initialValues: state.item.one
})

const mapDispatchToProps = {
  create: itemCreateRequest,
  update: itemUpdateRequest
}

const RForm = reduxForm({ form: 'item', enableReinitialize: true })(ItemForm)
export default connect(mapStateToProps, mapDispatchToProps)(RForm)