import React, { useState } from 'react'
import { connect } from 'react-redux'
import UsersForm from './UsersForm'

export const Users = ({ users, ...props }) => {
  const [add, setAdd] = useState(false)

  return (
    <div className='container'>
      <div className='row'>
        <UsersForm />
      </div>
      <div className='row'>
        <pre>{JSON.stringify(users, ' ', 2)}</pre>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
