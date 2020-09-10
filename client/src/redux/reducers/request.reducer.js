const intialState = {
  number: 0,
  inProgress: false
}

function isSuccess(type) {
  return type.substring(type.length - 8) === '_SUCCESS'
}

function isRequest(type) {
  return type.substring(type.length - 8) === '_PENDING'
}
function isFailure(type) {
  return type.substring(type.length - 8) === '_FAILURE'
}

export default function apiCallsInProgress(state = intialState, action) {
  if (isRequest(action.type)) {
    const number = state.number + 1
    const inProgress = number > 0
    return { number, inProgress }
  } else if (isSuccess(action.type)) {
    const number = state.number > 0 ? state.number - 1 : 0
    const inProgress = number > 0
    return { number, inProgress }
  } else if (isFailure(action.type)) {
    const number = state.number > 0 ? state.number - 1 : 0
    const inProgress = number > 0
    return { number, inProgress }
  }
  return state
}
