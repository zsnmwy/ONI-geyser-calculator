const router = require('koa-router')()
const API = require('./api')

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

module.exports = router
