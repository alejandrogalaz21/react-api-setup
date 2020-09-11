import React, { Component } from 'react'
import { connect } from 'react-redux'

export const Users = ({ user, ...props }) => {
  return (
    <div>
      <pre>{JSON.stringify(user, ' ', 2)}</pre>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
