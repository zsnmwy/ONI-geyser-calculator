const schedule = require('node-schedule')

module.exports = () => {
  /**
   * 定时任务 每天凌晨重置 token 计数器
   */
  schedule.scheduleJob('0 * * * * *', () => {
    console.log('schdule ' + new Date())
  })
}
