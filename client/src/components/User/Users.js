import React, { Component } from 'react'
import { connect } from 'react-redux'

export const Users = ({ users, ...props }) => {
  return (
    <div>
      <pre>{JSON.stringify(users, ' ', 2)}</pre>
    </div>
  )
}

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
