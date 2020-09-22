// Type's
export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST'
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS'
export const PRODUCT_CREATE_FAILURE = 'PRODUCT_CREATE_FAILURE'

export const PRODUCT_READ_MANY_REQUEST = 'PRODUCT_READ_MANY_REQUEST'
export const PRODUCT_READ_MANY_SUCCESS = 'PRODUCT_READ_MANY_SUCCESS'
export const PRODUCT_READ_MANY_FAILURE = 'PRODUCT_READ_MANY_FAILURE'

export const PRODUCT_READ_ONE_REQUEST = 'PRODUCT_READ_ONE_REQUEST'
export const PRODUCT_READ_ONE_SUCCESS = 'PRODUCT_READ_ONE_SUCCESS'
export const PRODUCT_READ_ONE_FAILURE = 'PRODUCT_READ_ONE_FAILURE'

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST'
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS'
export const PRODUCT_UPDATE_FAILURE = 'PRODUCT_UPDATE_FAILURE'

export const PRODUCT_REMOVE_REQUEST = 'PRODUCT_REMOVE_REQUEST'
export const PRODUCT_REMOVE_SUCCESS = 'PRODUCT_REMOVE_SUCCESS'
export const PRODUCT_REMOVE_FAILURE = 'PRODUCT_REMOVE_FAILURE'

export const PRODUCT_EDIT = 'PRODUCT_EDIT'

// Action's
export const productCreateRequest = payload => ({
  type: PRODUCT_CREATE_REQUEST,
  payload
})
export const productCreateSuccess = payload => ({ type: PRODUCT_CREATE_SUCCESS, payload })
export const productCreateFailure = (payload = null) => ({
  type: PRODUCT_CREATE_FAILURE,
  payload
})

export const productReadManyRequest = payload => ({
  type: PRODUCT_READ_MANY_REQUEST,
  payload
})
export const productReadManySuccess = payload => ({
  type: PRODUCT_READ_MANY_SUCCESS,
  payload
})
export const productReadManyFailure = (payload = null) => ({
  type: PRODUCT_READ_MANY_FAILURE,
  payload
})

export const productReadOneRequest = payload => ({
  type: PRODUCT_READ_ONE_REQUEST,
  payload
})
export const productReadOneSuccess = payload => ({ type: PRODUCT_READ_ONE_SUCCESS, payload })
export const productReadOneFailure = (payload = null) => ({
  type: PRODUCT_READ_ONE_FAILURE,
  payload
})

export const productUpdateRequest = payload => ({
  type: PRODUCT_UPDATE_REQUEST,
  payload
})
export const productUpdateSuccess = payload => ({ type: PRODUCT_UPDATE_SUCCESS, payload })
export const productUpdateFailure = (payload = null) => ({
  type: PRODUCT_UPDATE_FAILURE,
  payload
})

export const productRemoveRequest = payload => ({
  type: PRODUCT_REMOVE_REQUEST,
  payload
})
export const productRemoveSuccess = payload => ({ type: PRODUCT_REMOVE_SUCCESS, payload })
export const productRemoveFailure = (payload = null) => ({
  type: PRODUCT_REMOVE_FAILURE,
  payload
})

export const productEdit = id => ({ type: PRODUCT_EDIT, id })

// Reducer
const INITIAL_STATE = {
  one: {},
  many: []
}

export function products(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PRODUCT_CREATE_SUCCESS:
      return {
        ...state,
        many: [...state.many, action.payload].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      }
    case PRODUCT_READ_MANY_SUCCESS:
      return { ...state, many: [...action.payload] }
    case PRODUCT_READ_ONE_SUCCESS:
      return { ...state, one: { ...action.payload } }
    case PRODUCT_UPDATE_SUCCESS:
      return {
        ...state,
        many: [...state.many.filter(s => s.id !== action.payload.id), action.payload]
      }
    case PRODUCT_REMOVE_SUCCESS:
      return { ...state, many: [...state.many.filter(s => s.id !== action.payload.id)] }
    case PRODUCT_CREATE_FAILURE:
    case PRODUCT_READ_MANY_FAILURE:
    case PRODUCT_READ_ONE_FAILURE:
    case PRODUCT_UPDATE_FAILURE:
    case PRODUCT_REMOVE_FAILURE:
      alert(action.payload)
      return state
    default:
      return state
  }
}
