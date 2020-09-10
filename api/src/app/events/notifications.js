import events from 'events'
import * as sockets from './../../sockets/notificationWs'
import * as DAL from './../dal/notification'

const emitter = new events.EventEmitter()

emitter.on('notification', async function(data) {
  const payload = await DAL.createNotification(data)
  console.log(`Notification event: ${payload}`)
  await sockets.emitNotification(payload)
})

export const emitNotification = payload => emitter.emit('notification', payload)
export const subscribeToNotification = cb => emitter.on('notification', cb)
