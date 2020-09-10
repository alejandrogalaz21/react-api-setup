const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'

const INITIAL_STATE = {
  name: '',
  profile: null,
  permissions: [],
  isAuthenticated: false
}

export function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      }
    case USER_LOGIN_FAILURE:
      return INITIAL_STATE
    default:
      return state
  }
}
