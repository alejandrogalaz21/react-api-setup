import React from 'react'
import { connect } from 'react-redux'
import { aclSelector } from './aclSelectors'

function Acl(props) {
  const module = new RegExp(`^${props.module}`, 'i')
  const can = props.permissions.find(p => module.test(p.module) && p[props.acl])
  return can || props.user.role === 0 ? props.children : null
}

const mapStateToProps = state => aclSelector(state)
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Acl)
