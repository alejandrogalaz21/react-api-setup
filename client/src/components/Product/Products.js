import React, { useState } from 'react'
import { connect } from 'react-redux'
import ProductForm from './ProductForm'
import ProductTable from './ProductTable'

const Products = props => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className='container'>
      <div className='row'>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <button className='btn' onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Table' : 'Add +'}
            </button>
          </li>
        </ul>
      </div>
      {showForm ? <ProductForm /> : <ProductTable />}
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Products)
