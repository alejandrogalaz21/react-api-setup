import { io } from './../server'
import Notification from './../mvc/models/access'

/**
 * @export
 * @desc  function to use in the controller.
 */
export function emitNotification(uuid) {
  io.emit('NOTIFICATION', uuid)
}

/**
 * @param { uuid }
 * @desc  function to use in the controller
 */
export function subscribeNotification(socket) {
  socket.on('SUBSCRIBE_NOTIFICATION', () => {
    socket.emit('NOTIFICATION')
  })
}
