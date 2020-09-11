// Type's
export const USERS_CREATE_REQUEST = 'USERS_CREATE_REQUEST'
export const USERS_CREATE_SUCCESS = 'USERS_CREATE_SUCCESS'
export const USERS_CREATE_FAILURE = 'USERS_CREATE_FAILURE'

export const USERS_READ_MANY_REQUEST = 'USERS_READ_MANY_REQUEST'
export const USERS_READ_MANY_SUCCESS = 'USERS_READ_MANY_SUCCESS'
export const USERS_READ_MANY_FAILURE = 'USERS_READ_MANY_FAILURE'

export const USERS_READ_ONE_REQUEST = 'USERS_READ_ONE_REQUEST'
export const USERS_READ_ONE_SUCCESS = 'USERS_READ_ONE_SUCCESS'
export const USERS_READ_ONE_FAILURE = 'USERS_READ_ONE_FAILURE'

export const USERS_UPDATE_REQUEST = 'USERS_UPDATE_REQUEST'
export const USERS_UPDATE_SUCCESS = 'USERS_UPDATE_SUCCESS'
export const USERS_UPDATE_FAILURE = 'USERS_UPDATE_FAILURE'

export const USERS_REMOVE_REQUEST = 'USERS_REMOVE_REQUEST'
export const USERS_REMOVE_SUCCESS = 'USERS_REMOVE_SUCCESS'
export const USERS_REMOVE_FAILURE = 'USERS_REMOVE_FAILURE'

// Action's
export const usersCreateRequest = (payload = null) => ({type: USERS_CREATE_REQUEST, payload})
export const usersCreateSuccess = payload => ({ type: USERS_CREATE_SUCCESS, payload })
export const usersCreateFailure = (payload = null) => ({type: USERS_CREATE_FAILURE, payload})


export const usersReadManyRequest = (payload = null) => ({type: USERS_READ_MANY_REQUEST, payload})
export const usersReadManySuccess = payload => ({ type: USERS_READ_MANY_SUCCESS, payload })
export const usersReadManyFailure = (payload = null) => ({type: USERS_READ_MANY_FAILURE, payload})

export const usersReadOneRequest = (payload = null) => ({type: USERS_READ_ONE_REQUEST, payload})
export const usersReadOneSuccess = payload => ({ type: USERS_READ_ONE_SUCCESS, payload })
export const usersReadOneFailure = (payload = null) => ({type: USERS_READ_ONE_FAILURE, payload})

export const usersUpdateRequest = (payload = null) => ({type: USERS_UPDATE_REQUEST, payload})
export const usersUpdateSuccess = payload => ({ type: USERS_UPDATE_SUCCESS, payload })
export const usersUpdateFailure = (payload = null) => ({type: USERS_UPDATE_FAILURE, payload})

export const usersRemoveRequest = (payload = null) => ({type: USERS_REMOVE_REQUEST, payload})
export const usersRemoveSuccess = payload => ({ type: USERS_REMOVE_SUCCESS, payload })
export const usersRemoveFailure = (payload = null) => ({type: USERS_REMOVE_FAILURE, payload})

// Reducer

const INITIAL_STATE = {
  one: {},
  many: []
}

export function users(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERS_CREATE_SUCCESS:
      return { ...state, many: [...state.many, action.payload] }
    case USERS_READ_MANY_SUCCESS:
      return { ...state, many: [...action.payload] }
    case USERS_READ_ONE_SUCCESS:
      return { ...state, one: { ...action.payload } }
    case USERS_UPDATE_SUCCESS:
      return {
        ...state,
        many: [...state.many.filter(s => s.id !== action.payload.id), action.payload]
      }
    case USERS_REMOVE_SUCCESS:
      return { ...state, many: [...state.many.filter(s => s.id !== action.payload.id)] }

    default:
      return state
  }
}
