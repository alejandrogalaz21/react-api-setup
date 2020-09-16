import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductForm from './ProductForm'
import { productReadManyRequest, productReadOneRequest, productEdit } from './product.redux'

const ProductItem = props => {
  return (
    <div>
      <div>
        <pre>{JSON.stringify(props.product, ' ', 2)}</pre>
      </div>
      <ul
        style={{
          listStyle: 'none',
          flexDirection: 'row'
        }}>
        <li>
          <Link to={`/products/${props.product.id}`}>Detail</Link>
        </li>
        <li>
          <Link to={`/products/update/${props.product.id}`}>Update</Link>
        </li>
      </ul>
    </div>
  )
}

const Products = ({ products, ...props }) => {
  useEffect(() => {
    props.readMany()
  }, [])

  return (
    <div className='container'>
      <div className='row'>
        <ul
          style={{
            listStyle: 'none',
            flexDirection: 'row'
          }}>
          <li>
            <Link to='/products/create'>Create</Link>
          </li>
        </ul>
      </div>
      <div className='row'>
        <ProductForm />
      </div>
      <div
        className='row'
        style={{
          flexDirection: 'row'
        }}>
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.many
})

const mapDispatchToProps = {
  readMany: productReadManyRequest,
  readOne: productReadOneRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)
