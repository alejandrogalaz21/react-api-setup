import { defaultState } from './../defaultState'
import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './../types/notificationTypes'

export function notification(state = defaultState.notification, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...action.payload }
    case HIDE_NOTIFICATION:
      return { ...defaultState.notification }
    default:
      return state
  }
}
