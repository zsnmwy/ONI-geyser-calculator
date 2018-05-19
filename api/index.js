require('dotenv').config()
require('./crontab')()
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const Logger = require('koa-logger')
const BodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const router = require('./router')

const app = new Koa()
const port = process.env.PORT || 3000

app.use(Logger())

// Catching downstream errors
app.use(async (ctx, next) => {
  try { await next() } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

app.use(cors())

app.use(BodyParser({
  formLimit: '1mb',
}))

app.use(views(path.join(__dirname, 'views'), { extension: 'pug' }))

app.use(router.routes())

app.listen(port, () => {
  console.log(`koa is listening in port ${port}...`)
})
