// Type's
export const ITEM_CREATE_REQUEST = 'ITEM_CREATE_REQUEST'
export const ITEM_CREATE_SUCCESS = 'ITEM_CREATE_SUCCESS'
export const ITEM_CREATE_FAILURE = 'ITEM_CREATE_FAILURE'

export const ITEM_READ_MANY_REQUEST = 'ITEM_READ_MANY_REQUEST'
export const ITEM_READ_MANY_SUCCESS = 'ITEM_READ_MANY_SUCCESS'
export const ITEM_READ_MANY_FAILURE = 'ITEM_READ_MANY_FAILURE'

export const ITEM_READ_ONE_REQUEST = 'ITEM_READ_ONE_REQUEST'
export const ITEM_READ_ONE_SUCCESS = 'ITEM_READ_ONE_SUCCESS'
export const ITEM_READ_ONE_FAILURE = 'ITEM_READ_ONE_FAILURE'

export const ITEM_UPDATE_REQUEST = 'ITEM_UPDATE_REQUEST'
export const ITEM_UPDATE_SUCCESS = 'ITEM_UPDATE_SUCCESS'
export const ITEM_UPDATE_FAILURE = 'ITEM_UPDATE_FAILURE'

export const ITEM_REMOVE_REQUEST = 'ITEM_REMOVE_REQUEST'
export const ITEM_REMOVE_SUCCESS = 'ITEM_REMOVE_SUCCESS'
export const ITEM_REMOVE_FAILURE = 'ITEM_REMOVE_FAILURE'

export const ITEM_EDIT = 'ITEM_EDIT'

// Action's
export const itemCreateRequest = payload => ({ type: ITEM_CREATE_REQUEST, payload })
export const itemCreateSuccess = payload => ({ type: ITEM_CREATE_SUCCESS, payload })
export const itemCreateFailure = payload => ({ type: ITEM_CREATE_FAILURE, payload })

export const itemReadManyRequest = () => ({ type: ITEM_READ_MANY_REQUEST })
export const itemReadManySuccess = payload => ({
  type: ITEM_READ_MANY_SUCCESS,
  payload
})
export const itemReadManyFailure = payload => ({
  type: ITEM_READ_MANY_FAILURE,
  payload
})

export const itemReadOneRequest = id => ({ type: ITEM_READ_ONE_REQUEST, id })
export const itemReadOneSuccess = payload => ({ type: ITEM_READ_ONE_SUCCESS, payload })
export const itemReadOneFailure = payload => ({ type: ITEM_READ_ONE_FAILURE, payload })

export const itemUpdateRequest = payload => ({ type: ITEM_UPDATE_REQUEST, payload })
export const itemUpdateSuccess = payload => ({ type: ITEM_UPDATE_SUCCESS, payload })
export const itemUpdateFailure = payload => ({ type: ITEM_UPDATE_FAILURE, payload })

export const itemRemoveRequest = id => ({ type: ITEM_REMOVE_REQUEST, id })
export const itemRemoveSuccess = payload => ({ type: ITEM_REMOVE_SUCCESS, payload })
export const itemRemoveFailure = payload => ({ type: ITEM_REMOVE_FAILURE, payload })

export const itemEdit = id => ({ type: ITEM_EDIT, id })

// Reducer
const INITIAL_STATE = {
  one: {},
  many: []
}

export function items(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ITEM_CREATE_SUCCESS:
      return { ...state, many: [...state.many, action.payload] }
    case ITEM_READ_MANY_SUCCESS:
      return { ...state, many: [...action.payload] }
    case ITEM_READ_ONE_SUCCESS:
      return { ...state, one: { ...action.payload } }
    case ITEM_UPDATE_SUCCESS:
      return {
        ...state,
        many: [...state.many.filter(s => s.id !== action.payload.id), action.payload]
      }
    case ITEM_REMOVE_SUCCESS:
      return { ...state, many: [...state.many.filter(s => s.id !== action.payload.id)] }
    case ITEM_CREATE_FAILURE:
    case ITEM_READ_MANY_FAILURE:
    case ITEM_READ_ONE_FAILURE:
    case ITEM_UPDATE_FAILURE:
    case ITEM_REMOVE_FAILURE:
      alert(action.payload)
      return state
    default:
      return state
  }
}
