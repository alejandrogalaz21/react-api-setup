import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form } from 'redux-form'
import { RFInput, RFSelect } from './../../components/Inputs/RFFields'
import { productCreateRequest, productUpdateRequest } from './product.redux'
import { isEmpty } from './../../helpers'

export const ProductForm = ({ handleSubmit, pristine, submitting, reset, ...props }) => {
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

        {!isEmpty(props.initialValues) && (
          <RFSelect
            name='isActive'
            label='Estatus'
            options={[
              { value: true, label: 'activo' },
              { value: false, label: 'inactivo' }
            ]}
          />
        )}

        <br />

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
  initialValues: state.products.one
})

const mapDispatchToProps = {
  create: productCreateRequest,
  update: productUpdateRequest
}

const RForm = reduxForm({ form: 'product', enableReinitialize: true })(ProductForm)
export default connect(mapStateToProps, mapDispatchToProps)(RForm)
