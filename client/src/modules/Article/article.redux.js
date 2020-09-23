// Type's
export const ARTICLE_CREATE_REQUEST = 'ARTICLE_CREATE_REQUEST'
export const ARTICLE_CREATE_SUCCESS = 'ARTICLE_CREATE_SUCCESS'
export const ARTICLE_CREATE_FAILURE = 'ARTICLE_CREATE_FAILURE'

export const ARTICLE_READ_MANY_REQUEST = 'ARTICLE_READ_MANY_REQUEST'
export const ARTICLE_READ_MANY_SUCCESS = 'ARTICLE_READ_MANY_SUCCESS'
export const ARTICLE_READ_MANY_FAILURE = 'ARTICLE_READ_MANY_FAILURE'

export const ARTICLE_READ_ONE_REQUEST = 'ARTICLE_READ_ONE_REQUEST'
export const ARTICLE_READ_ONE_SUCCESS = 'ARTICLE_READ_ONE_SUCCESS'
export const ARTICLE_READ_ONE_FAILURE = 'ARTICLE_READ_ONE_FAILURE'

export const ARTICLE_UPDATE_REQUEST = 'ARTICLE_UPDATE_REQUEST'
export const ARTICLE_UPDATE_SUCCESS = 'ARTICLE_UPDATE_SUCCESS'
export const ARTICLE_UPDATE_FAILURE = 'ARTICLE_UPDATE_FAILURE'

export const ARTICLE_REMOVE_REQUEST = 'ARTICLE_REMOVE_REQUEST'
export const ARTICLE_REMOVE_SUCCESS = 'ARTICLE_REMOVE_SUCCESS'
export const ARTICLE_REMOVE_FAILURE = 'ARTICLE_REMOVE_FAILURE'

export const ARTICLE_EDIT = 'ARTICLE_EDIT'

// Action's
export const articleCreateRequest = payload => ({ type: ARTICLE_CREATE_REQUEST, payload })
export const articleCreateSuccess = payload => ({ type: ARTICLE_CREATE_SUCCESS, payload })
export const articleCreateFailure = payload => ({ type: ARTICLE_CREATE_FAILURE, payload })

export const articleReadManyRequest = () => ({ type: ARTICLE_READ_MANY_REQUEST })
export const articleReadManySuccess = payload => ({
  type: ARTICLE_READ_MANY_SUCCESS,
  payload
})
export const articleReadManyFailure = payload => ({
  type: ARTICLE_READ_MANY_FAILURE,
  payload
})

export const articleReadOneRequest = id => ({ type: ARTICLE_READ_ONE_REQUEST, id })
export const articleReadOneSuccess = payload => ({ type: ARTICLE_READ_ONE_SUCCESS, payload })
export const articleReadOneFailure = payload => ({ type: ARTICLE_READ_ONE_FAILURE, payload })

export const articleUpdateRequest = payload => ({ type: ARTICLE_UPDATE_REQUEST, payload })
export const articleUpdateSuccess = payload => ({ type: ARTICLE_UPDATE_SUCCESS, payload })
export const articleUpdateFailure = payload => ({ type: ARTICLE_UPDATE_FAILURE, payload })

export const articleRemoveRequest = id => ({ type: ARTICLE_REMOVE_REQUEST, id })
export const articleRemoveSuccess = payload => ({ type: ARTICLE_REMOVE_SUCCESS, payload })
export const articleRemoveFailure = payload => ({ type: ARTICLE_REMOVE_FAILURE, payload })

export const articleEdit = id => ({ type: ARTICLE_EDIT, id })

// Reducer
const INITIAL_STATE = {
  one: {},
  many: []
}

export function articles(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ARTICLE_CREATE_SUCCESS:
      return { ...state, many: [...state.many, action.payload], one: {} }
    case ARTICLE_READ_MANY_SUCCESS:
      return { ...state, many: [...action.payload] }
    case ARTICLE_READ_ONE_SUCCESS:
      return { ...state, one: { ...action.payload } }
    case ARTICLE_UPDATE_SUCCESS:
      return {
        ...state,
        many: [...state.many.filter(s => s.id !== action.payload.id), action.payload],
        one: {}
      }
    case ARTICLE_REMOVE_SUCCESS:
      return { ...state, many: [...state.many.filter(s => s.id !== action.payload.id)] }
    case ARTICLE_CREATE_FAILURE:
    case ARTICLE_READ_MANY_FAILURE:
    case ARTICLE_READ_ONE_FAILURE:
    case ARTICLE_UPDATE_FAILURE:
    case ARTICLE_REMOVE_FAILURE:
      alert(action.payload)
      return state
    default:
      return state
  }
}
