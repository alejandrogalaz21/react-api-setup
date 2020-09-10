import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

export const LoginForm = () => {
  const history = useHistory()

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false
  })

  const { email, password, remember } = form

  function handleOnChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const key = target.name
    setForm({ ...form, [key]: value })
  }

  function handleOnSubmit(event) {
    event.preventDefault()
    history.push('/dashboard')
  }

  return (
    <form onSubmit={handleOnSubmit} className='user'>
      <div className='form-group'>
        <input
          type='email'
          className='form-control form-control-user'
          id='exampleInputEmail'
          aria-describedby='emailHelp'
          placeholder='Enter Email Address...'
          name='email'
          value={email}
          onChange={handleOnChange}
        />
      </div>
      <div className='form-group'>
        <input
          type='password'
          className='form-control form-control-user'
          id='exampleInputPassword'
          placeholder='Password'
          name='password'
          value={password}
          onChange={handleOnChange}
        />
      </div>
      <div className='form-group'>
        <div className='custom-control custom-checkbox small'>
          <input
            type='checkbox'
            className='custom-control-input'
            id='customCheck'
            name='remember'
            value={remember}
            onChange={handleOnChange}
          />
          <label className='custom-control-label' htmlFor='customCheck'>
            Remember Me
          </label>
        </div>
      </div>
      <button className='btn btn-primary btn-user btn-block'>Login</button>
      <hr />
      <a href='index.html' className='btn btn-google btn-user btn-block'>
        <i className='fab fa-google fa-fw' /> Login with Google
      </a>
      <a href='index.html' className='btn btn-facebook btn-user btn-block'>
        <i className='fab fa-facebook-f fa-fw' /> Login with Facebook
      </a>
    </form>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
