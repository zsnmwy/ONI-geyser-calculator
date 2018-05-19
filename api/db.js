const sqlite = require('sqlite')

const dbConnection = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', { Promise }))
  .then(db => db.migrate()) // db migration
  .catch(err => console.error(err))

const sql = {
  insertToken: `INSERT INTO token (key, secret, user_name, create_time, counter)
                VALUES (?, ?, ?, ?, 0)`,
  queryToken: `SELECT * FROM token`,
}

module.exports = {
  async insertToken () {
    const db = await dbConnection
    return db.run(sql.insertToken, ['key', 'secret', 'mutoe', new Date().getTime()])
  },
  async queryToken () {
    const db = await dbConnection
    return db.all(sql.queryToken)
  },
}
