import { io } from './../server'
import Event from './../mvc/models/event'

const populate = [
  {
    path: 'entries.partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @desc  function to use in the controller.
 */
export function emitEventAccess(uuid) {
  io.emit('EVENT_ACCESS', uuid)
}

/**
 * @param { uuid }
 * @desc  function to use in the controller
 */
export function subscribeEventAccess(socket, uuid) {
  socket.on('SUBSCRIBE_EVENT_ACCESS', () => {
    socket.emit('EVENT_ACCESS', uuid)
  })
}
