import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Form } from 'redux-form'
import { RFInput, RFSelect } from './../../components/Inputs/RFFields'
import { articleCreateRequest, articleUpdateRequest } from './article.redux'
import { isEmpty } from './../../helpers'

export const ArticleForm = ({ handleSubmit, pristine, submitting, reset, ...props }) => {
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
  initialValues: state.articles.one
})

const mapDispatchToProps = {
  create: articleCreateRequest,
  update: articleUpdateRequest
}

const RForm = reduxForm({ form: 'article', enableReinitialize: true })(ArticleForm)
export default connect(mapStateToProps, mapDispatchToProps)(RForm)