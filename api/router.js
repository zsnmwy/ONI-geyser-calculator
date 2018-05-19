const router = require('koa-router')()
const API = require('./api')
const db = require('./db')

router.get('/', async ctx => {
  await ctx.render('index', {
    subpath: process.env.SUB_PATH || '',
  })
})

router.post('/upload', async ctx => {
  const token = await API.getAccessToken()

  const base64 = ctx.request.body.image
  const ocrResult = await API.ocr(token, base64)

  const result = API.analyze(ocrResult)

  ctx.body = result
})

router.get('/apiQuery', async ctx => {
  await db.queryTokens()
    .then(ret => {
      // secret mask
      ctx.body = ret.map(item => { item.secret = '***'; return item })
    })
    .catch(err => { ctx.throw(500, err) })
})

router.post('/insertToken', async ctx => {
  const { id, secret, name } = ctx.request.body
  // validation
  await API.getAccessToken({ id, secret })
    .catch(() => { ctx.throw(400, 'Invalid id/secret string.') })
    .then(() => db.insertToken({ id, secret, name }))
    .then(ret => { ctx.status = 201 })
    .catch(err => { ctx.throw(500, err) })
})

module.exports = router
