import React from 'react'
import { connect } from 'react-redux'

const Article = ({ article, ...props }) => {
  return (
    <div className='container'>
      <div className='row'>
        <pre>{JSON.stringify(article, ' ', 2)}</pre>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  article: state.articles.one
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Article)
