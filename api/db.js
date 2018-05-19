const sqlite = require('sqlite')

const dbConnection = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', { Promise }))
  .then(db => db.migrate()) // db migration
  .catch(err => console.error(err))

const sql = {
  insertToken: `INSERT INTO token (key, secret, user_name, create_time, counter)
                VALUES (?, ?, ?, ?, 0)`,
  queryToken: `SELECT * FROM token`,
  resetCounter: `UPDATE token SET counter = 0`,
}

module.exports = {
  async insertToken ({ key, secret, name }) {
    const db = await dbConnection

    // prevent SQL injection
    const regex = /\W/
    if (regex.test(key) || regex.test(secret) || regex.test(name)) {
      return Promise.reject(new Error('Illegal String!'))
    }

    return db.run(sql.insertToken, [key, secret, name, new Date().getTime()])
  },
  async queryToken () {
    const db = await dbConnection
    return db.all(sql.queryToken)
  },
  async resetCounter () {
    const db = await dbConnection
    return db.run(sql.resetCounter)
  },
}
