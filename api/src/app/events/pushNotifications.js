import events from 'events'
import moment from 'moment'

const myEmitter = new events.EventEmitter()

//Subscribe for ping event
myEmitter.on('createLog', function(request, payload = null, err = null) {
  const ip =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.ip
  const body = request.body
  const query = request.query
  const method = request.method
  const params = request.params
  const date = moment().format('LLLL')
  const success = err === null ? true : false
  const error = err
  console.log(`${method} ${ip} ${query ? '?' + params : ''} `)
  console.log({ success, ip, body, query, method, params, date, error })
})

myEmitter.on('updateLog', function(data) {
  console.log('updateLog: ')
  console.log({ data })
})

myEmitter.on('notification', function(data) {
  console.log(`notification event say : ${data}`)
})

export const notification = payload => myEmitter.emit('notification', payload)

export const subscribeNotification = cb => {
  return myEmitter.on('notification', function(data) {
    cb(data)
  })
}
