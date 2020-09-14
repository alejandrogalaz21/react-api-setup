import { io } from './../server'
import Access from './../mvc/models/access'

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @param {*} io
 * @description function to use in the controller.
 */
export async function emitAccess() {
  const payload = await Access.find().populate(populate).sort({ date: -1 })
  // .limit(10)
  io.emit('ACCESS', payload)
}

/**
 * @export
 * @param {*} socket
 * @description function tu use in the main ws.
 */
export async function subscribeAccess(socket) {
  socket.on('SUBSCRIBE_ACCESS', async () => {
    const payload = await Access.find()
      .populate(populate)
      .populate('institution', 'name code')
      .select('uuid partner date entry exit detail institution')
      .sort({ date: -1 })
    // .limit(10)
    socket.emit('ACCESS', payload)
  })
}
