import mysql from 'mysql'

const connection = mysql.createConnection({
  host: 'dev_mysql',
  user: 'root',
  password: 'root'
})

connection.connect()

export { connection }
