import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import LoginForm from './LoginForm'

export const Login = ({ user, ...props }) => {
  useEffect(() => {
    const body = document.body
    body.classList.add('bg-gradient-primary')
    if (user.isAuthenticated) {
      props.history.push('/home')
    }
    return () => {
      body.classList.remove('bg-gradient-primary')
    }
  })

  const [form, setForm] = useState({
    user: '',
    password: '',
    remember: false
  })

  function handleOnSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className='container'>
      {/* Outer Row */}
      <div className='row justify-content-center'>
        <div className='col-xl-10 col-lg-12 col-md-9'>
          <div className='card o-hidden border-0 shadow-lg my-5'>
            <div className='card-body p-0'>
              {/* Nested Row within Card Body */}
              <div className='row'>
                <div className='col-lg-6 d-none d-lg-block bg-login-image' />
                <div className='col-lg-6'>
                  <div className='p-5'>
                    <div className='text-center'>
                      <h1 className='h4 text-gray-900 mb-4'>Welcome Back!</h1>
                    </div>
                    <LoginForm />
                    <hr />
                    <div className='text-center'>
                      <a className='small' href='forgot-password.html'>
                        Forgot Password?
                      </a>
                    </div>
                    <div className='text-center'>
                      <a className='small' href='register.html'>
                        Create an Account!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ user: state.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
