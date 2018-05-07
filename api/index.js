const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const Logger = require('koa-logger')
const BodyParser = require('koa-bodyparser')

const router = require('./router')

const app = new Koa()
app.use(Logger())
app.use(BodyParser())
app.use(views(path.join(__dirname, 'views'), { extension: 'pug' }))

app.use(router.routes())

app.listen(3000, () => {
  console.log('koa is listening in port 3000...')
})
