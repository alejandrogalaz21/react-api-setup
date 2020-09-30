// inter face

export const SHOW_INTERFACE = 'SHOW_INTERFACE'

export const showInterface = show => ({ type: SHOW_INTERFACE, show })

export function show(state = false, action) {
  switch (action.type) {
    case SHOW_INTERFACE:
      return action.show
    default:
      return state
  }
}

export const getReport = template => ({ type: 'REPORT', template })
