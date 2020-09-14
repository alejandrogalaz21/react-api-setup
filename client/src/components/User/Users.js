import React from 'react'
import { connect } from 'react-redux'
import UsersForm from './UsersForm'

export const Users = ({ user, ...props }) => {
  return (
    <div className='container'>
      <div className='row'>
        <UsersForm />
      </div>
      <div className='row'>
        <pre>{JSON.stringify(user, ' ', 2)}</pre>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
