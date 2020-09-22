import React from 'react'
import { connect } from 'react-redux'

const Item = ({ item, ...props }) => {
  return (
    <div className='container'>
      <div className='row'>
        <pre>{JSON.stringify(item, ' ', 2)}</pre>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  item: state.items.one
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Item)
