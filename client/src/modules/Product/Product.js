import React from 'react'
import { connect } from 'react-redux'

const Product = ({ product, ...props }) => {
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
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Product)
