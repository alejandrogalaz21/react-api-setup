import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Product from './Product'
import ProductForm from './ProductForm'
import { productReadOneRequest } from './product.redux'
import { isEmpty } from '../../helpers'

const ProductUpdate = ({ product, ...props }) => {
  useEffect(() => {
    if (isEmpty(product)) {
      const id = props.match.params.id
      props.readOne(id)
    }
  }, [])

  const [showForm, setShowForm] = useState(false)

  return (
    <div className='container'>
      <div className='row'>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <button className='btn' onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Detail' : 'Update'}
            </button>
          </li>
          <li className='list-inline-item'>
            <button className='btn'>Delete</button>
          </li>
        </ul>
      </div>
      {showForm ? <ProductForm /> : <Product />}
    </div>
  )
}

const mapStateToProps = state => ({
  product: state.products.one
})

const mapDispatchToProps = {
  readOne: productReadOneRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductUpdate)
