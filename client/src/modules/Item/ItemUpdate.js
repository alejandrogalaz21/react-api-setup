import React, { useState } from 'react'
import { connect } from 'react-redux'
import ItemForm from './ItemForm'
import ItemTable from './ItemTable'

const Items = props => {
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
      {showForm ? <ItemForm /> : <ItemTable />}
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Items)
