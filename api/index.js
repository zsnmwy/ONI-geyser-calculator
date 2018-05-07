const Koa = require('koa')
const BodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(BodyParser())

app.use(ctx => {
  ctx.body = ctx.request.body
})

app.listen(3000, () => {
  console.log('koa is listening in port 3000...')
})
