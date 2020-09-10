import { io } from './../server'

/**
 * @param {*} io
 * @description function to use in the controller.
 */
export async function emitNotification() {
  io.emit('NOTIFICATION')
}

/**
 * @param {*} socket
 * @description function tu use in the main ws.
 */
export async function subscribeToNotification(socket) {
  socket.on('SUBSCRIBE_NOTIFICATION', () => {
    socket.emit('NOTIFICATION')
  })
}
