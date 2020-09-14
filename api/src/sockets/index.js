import chalk from 'chalk'
import { subscribeAccess } from './accessWs'
import { subscribeToGroups } from './groupsWs'
import { subscribeToNotification } from './notificationWs'
import { isEmpty } from './../util'

let connections = []

export default function (io) {
  return io.on('connection', socket => {
    const socketId = socket.id
    const connection = { socket: socketId, user: {} }
    connections.push(connection)

    console.log(chalk.green('new socket connection :  ' + socket.id))

    // Access
    subscribeAccess(socket)
    // Groups
    subscribeToGroups(socket)
    // Notifications
    subscribeToNotification(socket)

    socket.on('disconnect', () => {
      connections = connections.filter(s => s.socket !== socketId)
      console.log(chalk.redBright('socket :  ' + socket.id + ' disconnect'))
    })

    // Listen when a user authenticates
    // and updates the list of connections (sockets)
    // @notify all
    socket.on('auth', async userData => {
      const index = connections.findIndex(c => c.socket === socketId)
      const user = { ...userData }
      const connection = { socket: socketId, user }
      connections = [
        ...connections.slice(0, index),
        connection,
        ...connections.slice(index + 1)
      ]
      io.emit('auth', connections)
    })

    // Listen when a user is inactived or its role is changed
    // @notify modified user
    socket.on('dumpuser', _id => {
      const list = connections.filter(c => !isEmpty(c.user._id) && c.user._id === _id)
      for (const connection of list) {
        const to = connection.socket
        io.to(to).emit('dumpuser', {})
      }
    })
  })
}
