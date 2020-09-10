// types
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'
// actions
export const setUserLoginRequest = payload => ({ type: USER_LOGIN_REQUEST, payload })
export const setUserLoginSuccess = payload => ({ type: USER_LOGIN_SUCCESS, payload })
export const setUserLoginFailure = payload => ({ type: USER_LOGIN_FAILURE, payload })

// CREATE
// UPDATE
// DELETE

const initialState = {
  name: '',
  profile: null,
  permissions: [],
  isAuthenticated: false
}

export function user(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      }
    case USER_LOGIN_FAILURE:
      return initialState
    default:
      return state
  }
}
