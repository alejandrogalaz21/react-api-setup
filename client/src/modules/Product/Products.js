import React, { useState } from 'react'
import { connect } from 'react-redux'
import ProductForm from './ProductForm'
import ProductTable from './ProductTable'
import axios from 'axios'

const Products = props => {
  const [showForm, setShowForm] = useState(false)

  function handleClickJsReport() {
    axios
      .post('/api/report', {
        template: { name: '/test/test' },
        recipe: 'chrome-pdf'
      })
      .then(data => {
        debugger
        console.log(data)
      })
      .catch(error => {
        debugger
        console.log(error)
      })
  }

  return (
    <div className='container'>
      <div className='row'>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <button className='btn' onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Table' : 'Add +'}
            </button>
            <button onClick={handleClickJsReport}>JS Report</button>
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
