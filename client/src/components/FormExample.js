import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form } from 'redux-form'
import { RFInput, RFRadio, RFSelect, RFSelectAsync } from './Inputs/RFFields'

function FormExample({ handleSubmit, pristine, submitting, reset }) {
  function handleClickSubmit(values) {
    alert(JSON.stringify(values, null, 2))
    console.log({ values })
    if (values.edit) {
      console.log('Update values')
    } else {
      console.log('Create a new record')
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleClickSubmit)} className='form-example'>
      <RFInput name='name' type='text' label='Nombre completo' />

      <RFRadio
        name='gender'
        label='Género'
        options={[
          { id: 'gender-male', label: 'Masculino', value: 'M' },
          { id: 'gender-female', label: 'Femenino', value: 'F' }
        ]}
      />

      <RFInput name='comment' type='textarea' label='Comentario' />

      <RFSelect
        name='university'
        label='Universidad'
        options={[
          { value: 'ITESM', label: 'Tecnológico de Monterrey' },
          { value: 'UDEM', label: 'Universidad de Monterrey' },
          { value: 'UAM', label: 'Universidad Autonoma de México' }
        ]}
      />

      <RFSelectAsync
        name='task'
        label='Selecciona una tarea'
        url='https://jsonplaceholder.typicode.com/todos/'
        formattter={useCallback(item => ({ label: item.title, value: item.id }), [])}
      />

      <div>
        <button type='submit' disabled={submitting}>
          Enviar
        </button>
        <button type='button' disabled={pristine || submitting} onClick={reset}>
          Reestablecer valores
        </button>
      </div>
    </Form>
  )
}

const mapStateToProps = state => ({
  initialValues: {
    edit: false,
    name: 'Joseph Somerville',
    university: 'UDEM'
  }
})

const RFUser = reduxForm({ form: 'formExample', enableReinitialize: true })(FormExample)
export default connect(mapStateToProps)(RFUser)
