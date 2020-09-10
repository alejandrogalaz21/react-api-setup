import React from 'react'
import { connect } from 'react-redux'

export const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
