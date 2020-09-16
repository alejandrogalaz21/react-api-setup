import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { productReadOneRequest } from './product.redux'
import { isEmpty } from './../../helpers'

const Product = ({ product, ...props }) => {
  useEffect(() => {
    if (isEmpty(product)) {
      const id = props.match.params.id
      props.readOne(id)
    }
  }, [])

  return (
    <div className='container'>
      <div className='row'>
        <pre>{JSON.stringify(product, ' ', 2)}</pre>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  product: state.products.one
})

const mapDispatchToProps = {
  readOne: productReadOneRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
