const router = require('koa-router')()
const API = require('./api')
const db = require('./db')

router.get('/', async ctx => {
  await ctx.render('index', {
    subpath: process.env.SUB_PATH || '',
  })
})

router.post('/upload', async ctx => {
  const base64 = ctx.request.body.image
  const rows = await db.queryTokens()
  if (!ocrResult.words_result) return ctx.throw(500, 'Maximum number of invocations.')
  let ocrResult
  for (let row of rows) {
    const { id, secret } = row
    const token = await API.getAccessToken({ id, secret })
    if (token === 401) {
      // TODO: remove invalid id/secret pair
      continue
    }

    ocrResult = await API.ocr(token, base64)
    if (ocrResult && ocrResult.error_code === 17) {
      // TODO: daily request limit reached.
      continue
    }
    if (ocrResult && ocrResult.words_result) {
      // TODO: increase token counter
      break
    }
  }
  if (!ocrResult) return ctx.throw(500, 'There is no id/secret pair that you can use.')

  const result = API.analyze(ocrResult.words_result)

  ctx.body = result
})

router.get('/apiQuery', async ctx => {
  await db.queryTokens(true)
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
    .catch(() => { ctx.throw(401, 'Invalid id/secret string.') })
    .then(() => db.insertToken({ id, secret, name }))
    .then(ret => { ctx.status = 201 })
    .catch(err => { ctx.throw(500, err) })
})

module.exports = router
