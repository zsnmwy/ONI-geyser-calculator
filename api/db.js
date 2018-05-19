const sqlite = require('sqlite')

const dbConnection = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', { Promise }))
  .then(db => db.migrate()) // db migration
  .catch(err => console.error(err))

const sql = {
  insertToken: `INSERT INTO token (id, secret, user_name, create_time, counter, status)
                VALUES (?, ?, ?, ?, 0, 1)`,
  queryTokens: `SELECT * FROM token WHERE counter < 500 AND status > 0`,
  queryAllTokens: `SELECT * FROM token`,
  setCounter: `UPDATE token SET counter = ? WHERE id = ?`,
  resetCounter: `UPDATE token SET counter = 0`,
  increaseCounter: `UPDATE token SET counter = counter + 1 WHERE id = ?`,
  removeToken: `DELETE FROM token WHERE id = ?`,
  setTokenInvalid: `UPDATE token SET status = -1 WHERE id = ?`,
}

module.exports = {
  async insertToken ({ id, secret, name }) {
    const db = await dbConnection

    // prevent SQL injection
    const regex = /\W/
    if (regex.test(id) || regex.test(secret) || regex.test(name)) {
      return Promise.reject(new Error('Illegal String!'))
    }

    return db.run(sql.insertToken, [id, secret, name, new Date().getTime()])
  },

  async queryTokens (queryAll = false) {
    const db = await dbConnection
    return db.all(queryAll ? sql.queryAllTokens : sql.queryTokens)
  },

  async resetCounter (id, counter) {
    const db = await dbConnection
    if (id) {
      return db.run(sql.setCounter, [counter, id])
    }
    return db.run(sql.resetCounter)
  },

  async increaseCounter (id) {
    const db = await dbConnection
    return db.run(sql.increaseCounter, id)
  },

  async setTokenInvalid (id) {
    const db = await dbConnection
    return db.run(sql.setTokenInvalid, id)
  }
}
