import React, { Component } from 'react'
import { connect } from 'react-redux'

export const Users = ({ user, ...props }) => {
  return <div>{JSON.parse(user, ' ', 2)}</div>
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
