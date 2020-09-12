// Type's
export const PRODUCTS_CREATE_REQUEST = 'PRODUCTS_CREATE_REQUEST'
export const PRODUCTS_CREATE_SUCCESS = 'PRODUCTS_CREATE_SUCCESS'
export const PRODUCTS_CREATE_FAILURE = 'PRODUCTS_CREATE_FAILURE'

export const PRODUCTS_READ_MANY_REQUEST = 'PRODUCTS_READ_MANY_REQUEST'
export const PRODUCTS_READ_MANY_SUCCESS = 'PRODUCTS_READ_MANY_SUCCESS'
export const PRODUCTS_READ_MANY_FAILURE = 'PRODUCTS_READ_MANY_FAILURE'

export const PRODUCTS_READ_ONE_REQUEST = 'PRODUCTS_READ_ONE_REQUEST'
export const PRODUCTS_READ_ONE_SUCCESS = 'PRODUCTS_READ_ONE_SUCCESS'
export const PRODUCTS_READ_ONE_FAILURE = 'PRODUCTS_READ_ONE_FAILURE'

export const PRODUCTS_UPDATE_REQUEST = 'PRODUCTS_UPDATE_REQUEST'
export const PRODUCTS_UPDATE_SUCCESS = 'PRODUCTS_UPDATE_SUCCESS'
export const PRODUCTS_UPDATE_FAILURE = 'PRODUCTS_UPDATE_FAILURE'

export const PRODUCTS_REMOVE_REQUEST = 'PRODUCTS_REMOVE_REQUEST'
export const PRODUCTS_REMOVE_SUCCESS = 'PRODUCTS_REMOVE_SUCCESS'
export const PRODUCTS_REMOVE_FAILURE = 'PRODUCTS_REMOVE_FAILURE'

// Action's
export const productsCreateRequest = payload => ({
  type: PRODUCTS_CREATE_REQUEST,
  payload
})
export const productsCreateSuccess = payload => ({ type: PRODUCTS_CREATE_SUCCESS, payload })
export const productsCreateFailure = (payload = null) => ({
  type: PRODUCTS_CREATE_FAILURE,
  payload
})

export const productsReadManyRequest = payload => ({
  type: PRODUCTS_READ_MANY_REQUEST,
  payload
})
export const productsReadManySuccess = payload => ({
  type: PRODUCTS_READ_MANY_SUCCESS,
  payload
})
export const productsReadManyFailure = (payload = null) => ({
  type: PRODUCTS_READ_MANY_FAILURE,
  payload
})

export const productsReadOneRequest = payload => ({
  type: PRODUCTS_READ_ONE_REQUEST,
  payload
})
export const productsReadOneSuccess = payload => ({ type: PRODUCTS_READ_ONE_SUCCESS, payload })
export const productsReadOneFailure = (payload = null) => ({
  type: PRODUCTS_READ_ONE_FAILURE,
  payload
})

export const productsUpdateRequest = payload => ({
  type: PRODUCTS_UPDATE_REQUEST,
  payload
})
export const productsUpdateSuccess = payload => ({ type: PRODUCTS_UPDATE_SUCCESS, payload })
export const productsUpdateFailure = (payload = null) => ({
  type: PRODUCTS_UPDATE_FAILURE,
  payload
})

export const productsRemoveRequest = payload => ({
  type: PRODUCTS_REMOVE_REQUEST,
  payload
})
export const productsRemoveSuccess = payload => ({ type: PRODUCTS_REMOVE_SUCCESS, payload })
export const productsRemoveFailure = (payload = null) => ({
  type: PRODUCTS_REMOVE_FAILURE,
  payload
})

// Reducer
const INITIAL_STATE = {
  one: {},
  many: []
}

export function products(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PRODUCTS_CREATE_SUCCESS:
      return { ...state, many: [...state.many, action.payload] }
    case PRODUCTS_READ_MANY_SUCCESS:
      return { ...state, many: [...action.payload] }
    case PRODUCTS_READ_ONE_SUCCESS:
      return { ...state, one: { ...action.payload } }
    case PRODUCTS_UPDATE_SUCCESS:
      return {
        ...state,
        many: [...state.many.filter(s => s.id !== action.payload.id), action.payload]
      }
    case PRODUCTS_REMOVE_SUCCESS:
      return { ...state, many: [...state.many.filter(s => s.id !== action.payload.id)] }
    case PRODUCTS_CREATE_FAILURE:
    case PRODUCTS_READ_MANY_FAILURE:
    case PRODUCTS_READ_ONE_FAILURE:
    case PRODUCTS_UPDATE_FAILURE:
    case PRODUCTS_REMOVE_FAILURE:
      alert(action.payload)
      return state
    default:
      return state
  }
}
