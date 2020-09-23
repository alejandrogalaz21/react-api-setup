import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Article from './Article'
import ArticleForm from './ArticleForm'
import { articleReadOneRequest } from './article.redux'
import { isEmpty } from './../../helpers'

const ArticleUpdate = ({ product, ...props }) => {
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
      {showForm ? <ArticleForm /> : <Article />}
    </div>
  )
}

const mapStateToProps = state => ({
  product: state.articles.one
})

const mapDispatchToProps = {
  readOne: articleReadOneRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleUpdate)