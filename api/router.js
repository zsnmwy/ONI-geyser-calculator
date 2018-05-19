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

router.get('/queryToken', async ctx => {
  ctx.body = await db.queryToken()
})

router.get('/insertToken', async ctx => {
  await db.insertToken()
    .then(ret => {
      ctx.body = ret
    }).catch(err => {
      ctx.throw(err)
    })
})

module.exports = router
