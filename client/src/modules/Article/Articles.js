import React, { useState } from 'react'
import { connect } from 'react-redux'
import ArticleForm from './ArticleForm'
import ArticleTable from './ArticleTable'

const Articles = props => {
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
      {showForm ? <ArticleForm /> : <ArticleTable />}
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Articles)
