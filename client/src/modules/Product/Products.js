import React, { useState } from 'react'
import { connect } from 'react-redux'
import ProductForm from './ProductForm'
import ProductTable from './ProductTable'
import { getReport } from './../../redux/global'

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
            <button onClick={() => props.getReport({ name: '/test/test' })}>JS Report</button>
          </li>
        </ul>
      </div>
      {showForm ? <ProductForm /> : <ProductTable />}
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = { getReport }

export default connect(mapStateToProps, mapDispatchToProps)(Products)
