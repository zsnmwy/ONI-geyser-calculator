const schedule = require('node-schedule')
const db = require('./db')

module.exports = () => {
  /**
   * 定时任务 每天凌晨重置 token 计数器
   */
  schedule.scheduleJob('0 0 0 * * *', () => {
    console.log('The crontab was triggered on ' + new Date())
    db.resetCounter()
      .then(ret => { console.log('The token counter was reset successfully.') })
      .catch(err => { console.error(err) })
  })
}
